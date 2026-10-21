# Read-only DNS reconnaissance. This cannot enumerate every registrar DNS record.
# Always obtain a FULL zone export before changing nameservers.
$ErrorActionPreference='Continue'
$names=@('makhex.com','www.makhex.com','shop.makhex.com')
$types=@('NS','A','AAAA','CNAME','MX','TXT','CAA','DS')
$stamp=Get-Date -Format 'yyyyMMdd-HHmmss'
$report=Join-Path (Get-Location) 'reports'
New-Item -ItemType Directory -Path $report -Force | Out-Null
$entries=@()
foreach($name in $names) {
  foreach($type in $types) {
    try {
      $rows=@(Resolve-DnsName -Name $name -Type $type -ErrorAction Stop | Where-Object { $_.Type -eq $type })
      foreach($row in $rows) {
        $record=[ordered]@{
          Name=$name; Type=$type; TTL=$row.TTL
          Data=if($type -eq 'A' -or $type -eq 'AAAA') { $row.IPAddress } elseif($type -eq 'CNAME' -or $type -eq 'NS') {$row.NameHost} elseif($type -eq 'MX') { $row.NameExchange } elseif($type -eq 'TXT') { $row.Strings -join '' } else { [string]$row }
        }
        $entries += [pscustomobject]$record
      }
    } catch {
      Write-Output ('No record / lookup error for '+$name+' '+$type)
    }
  }
}
$dest=Join-Path $report ('dns-readonly-'+$stamp+'.json')
$entries | ConvertTo-Json -Depth 6 | Set-Content -Path $dest -Encoding UTF8
Write-Output ('Captured '+$entries.Count+' public DNS answers locally (not a complete zone export).')
Write-Output ('Local record file: '+$dest)
Write-Output 'IMPORTANT: This snapshot CANNOT prove all MX, TXT, verification, SRV or unpublished subdomain records are preserved.'
