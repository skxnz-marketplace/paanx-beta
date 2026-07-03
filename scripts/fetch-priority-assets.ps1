$ErrorActionPreference = "Stop"
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

$today = "2026-07-04"
$prioritySlugs = @(
  "coca-cola-750ml",
  "coca-cola-can-300ml",
  "thums-up-750ml",
  "sprite-750ml",
  "fanta-750ml",
  "maaza-600ml",
  "pepsi-750ml",
  "mountain-dew-750ml",
  "sting-energy-250ml",
  "red-bull-250ml",
  "bisleri-1l",
  "kinley-1l",
  "lays-magic-masala-48g",
  "lays-classic-salted-48g",
  "lays-american-cream-onion-48g",
  "kurkure-masala-munch-75g",
  "bingo-mad-angles-achaari-masti-66g",
  "bingo-tedhe-medhe-80g",
  "uncle-chipps-spicy-treat-50g",
  "pringles-original-107g",
  "haldirams-aloo-bhujia-200g",
  "haldirams-moong-dal-200g",
  "parle-g-original-70g",
  "parle-hide-seek-chocolate-100g",
  "britannia-good-day-cashew-75g",
  "britannia-marie-gold-120g",
  "oreo-vanilla-creme-43g",
  "britannia-bourbon-100g",
  "cadbury-dairy-milk-23g",
  "cadbury-5-star-40g",
  "center-fresh-mint-pouch",
  "center-fruit-pouch",
  "orbit-spearmint-22g",
  "mentos-mint-roll",
  "pulse-kachcha-aam-candy",
  "happydent-white-pouch",
  "polo-mint-roll",
  "pass-pass-classic-pouch",
  "rajnigandha-pearls-tin",
  "baba-elaichi-pouch",
  "gulkand-jar-200g",
  "kattha-paste-50g",
  "chuna-tube-30g",
  "tutti-frutti-100g",
  "cutting-supari-100g",
  "flavoured-saunf-mix-100g",
  "rajnigandha-pan-masala-pouch",
  "rajnigandha-pan-masala-tin",
  "pan-bahar-pouch",
  "vimal-pan-masala-pouch",
  "classic-milds-pack-20",
  "gold-flake-kings-pack-20",
  "wills-navy-cut-pack-10",
  "marlboro-red-pack-20",
  "chaini-khaini-pouch",
  "hans-chhap-zarda",
  "afzal-pan-ras-flavour-50g",
  "soex-herbal-double-apple-50g",
  "ship-matchbox-single",
  "pocket-lighter-standard"
)

$folderByCategory = @{
  "cold-drinks" = "beverages"
  "water-soda" = "beverages"
  "chips" = "chips-snacks"
  "namkeen" = "chips-snacks"
  "biscuits" = "biscuits-chocolates"
  "chocolates" = "biscuits-chocolates"
  "mints-gum" = "mints-gum"
  "mouth-fresheners" = "mouth-fresheners"
  "paan-ingredients" = "paan-ingredients"
  "supari-saunf" = "paan-ingredients"
  "pan-masala" = "pan-masala"
  "cigarettes" = "cigarettes"
  "khaini-zarda" = "khaini-zarda"
  "hookah-flavours" = "hookah-accessories"
  "lighters-accessories" = "accessories"
}

$productPath = "src\data\products.ts"
$lines = Get-Content -LiteralPath $productPath

function Get-Field {
  param([string]$Line, [string]$Field)
  $pattern = "$Field`: `"([^`"]*)`""
  $match = [regex]::Match($Line, $pattern)
  if ($match.Success) { return $match.Groups[1].Value }
  return ""
}

function Set-Field {
  param([string]$Line, [string]$Field, [string]$Value)
  $escaped = $Value.Replace("\", "\\")
  if ($Line -match "$Field`: `"") {
    return [regex]::Replace($Line, "$Field`: `"[^`"]*`"", "$Field`: `"$escaped`"")
  }
  return $Line -replace ", isRestricted:", ", $Field`: `"$escaped`", isRestricted:"
}

function Remove-ImageNeeded {
  param([string]$Line)
  return $Line.Replace(', "image_needed"', '').Replace('"image_needed", ', '').Replace('"image_needed"', '')
}

function Strip-Pack {
  param([string]$PackSize)
  return ($PackSize -replace "\(.*?\)", "" -replace "\bPET\b", "" -replace "\bcan\b", "" -replace "\bbottle\b", "" -replace "\bpouch\b", "" -replace "\bpack\b", "" -replace "\bStandard\b", "").Trim()
}

$products = @()
for ($i = 0; $i -lt $lines.Count; $i++) {
  if ($lines[$i] -match "^  \{ id:") {
    $products += [pscustomobject]@{
      Index = $i
      Id = Get-Field $lines[$i] "id"
      Slug = Get-Field $lines[$i] "slug"
      Name = Get-Field $lines[$i] "name"
      Brand = Get-Field $lines[$i] "brand"
      Category = Get-Field $lines[$i] "category"
      PackSize = Get-Field $lines[$i] "packSize"
    }
  }
}

$results = @()
foreach ($slug in $prioritySlugs) {
  $product = $products | Where-Object { $_.Slug -eq $slug } | Select-Object -First 1
  if (-not $product) { continue }

  try {
    $query = "$($product.Name) $($product.Brand) $(Strip-Pack $product.PackSize) India" -replace "\s+", " "
    $encoded = [uri]::EscapeDataString($query.Trim())
    $url = "https://world.openfoodfacts.org/cgi/search.pl?search_terms=$encoded&search_simple=1&action=process&json=1&page_size=5&fields=product_name,brands,quantity,image_front_url,image_url,url"
    $json = Invoke-WebRequest -Uri $url -UseBasicParsing -Headers @{ "User-Agent" = "PAANX beta catalog research" } | Select-Object -ExpandProperty Content | ConvertFrom-Json
    $brandNeedle = ($product.Brand -replace "\s*\([^)]*\)", "" -replace "!$", "").ToLowerInvariant().Split(" ")[0]
    $candidate = $null
    foreach ($item in @($json.products)) {
      $imageUrl = if ($item.image_front_url) { $item.image_front_url } else { $item.image_url }
      if (-not $imageUrl) { continue }
      $haystack = "$($item.product_name) $($item.brands)".ToLowerInvariant()
      if ($brandNeedle -eq "loose" -or $haystack.Contains($brandNeedle)) {
        $candidate = $item
        break
      }
    }

    if (-not $candidate) {
      $results += [pscustomobject]@{ slug = $slug; status = "source_not_found"; sourceUrl = ""; image = ""; notes = "No matching Open Food Facts image result" }
      continue
    }

    $remoteImage = if ($candidate.image_front_url) { $candidate.image_front_url } else { $candidate.image_url }
    $folder = if ($folderByCategory.ContainsKey($product.Category)) { $folderByCategory[$product.Category] } else { "accessories" }
    $localImage = "/products/$folder/$($product.Slug).jpg"
    $destination = Join-Path "public" ($localImage.TrimStart("/") -replace "/", "\")
    New-Item -ItemType Directory -Force (Split-Path $destination) | Out-Null
    Invoke-WebRequest -Uri $remoteImage -OutFile $destination -UseBasicParsing -Headers @{ "User-Agent" = "PAANX beta catalog research" }

    if ((Get-Item $destination).Length -lt 1024) {
      Remove-Item -LiteralPath $destination -Force
      throw "Downloaded image too small"
    }

    $line = $lines[$product.Index]
    $line = Set-Field $line "image" $localImage
    $line = Set-Field $line "sourceUrl" $candidate.url
    $line = Set-Field $line "sourceName" "Open Food Facts"
    $line = Set-Field $line "lastChecked" $today
    $line = Remove-ImageNeeded $line
    $lines[$product.Index] = $line

    $results += [pscustomobject]@{ slug = $slug; status = "image_downloaded"; sourceUrl = $candidate.url; image = $localImage; imageSourceUrl = $remoteImage; notes = "" }
  } catch {
    $results += [pscustomobject]@{ slug = $slug; status = "download_failed"; sourceUrl = ""; image = ""; notes = $_.Exception.Message }
  }
}

Set-Content -LiteralPath $productPath -Value $lines -Encoding UTF8
$results | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath "research\paanx-priority-asset-fetch-results.json" -Encoding UTF8
$downloaded = @($results | Where-Object { $_.status -eq "image_downloaded" }).Count
[pscustomobject]@{
  priorityRequested = @($prioritySlugs).Count
  downloaded = $downloaded
  unresolved = @($prioritySlugs).Count - $downloaded
} | ConvertTo-Json
