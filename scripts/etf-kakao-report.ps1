$REST_API_KEY = "d6aba40df46b9ec7731beab539e07777"
$TOKEN_FILE = "$PSScriptRoot\..\kakao-tokens.json"

function Load-Tokens {
    if (Test-Path $TOKEN_FILE) {
        return Get-Content $TOKEN_FILE -Encoding UTF8 | ConvertFrom-Json
    }
    return $null
}

function Save-Tokens($accessToken, $refreshToken) {
    @{
        access_token  = $accessToken
        refresh_token = $refreshToken
        saved_at      = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    } | ConvertTo-Json | Out-File $TOKEN_FILE -Encoding UTF8
}

function Get-ValidToken($tokens) {
    $body = "grant_type=refresh_token&client_id=$REST_API_KEY&refresh_token=$($tokens.refresh_token)"
    try {
        $res = Invoke-WebRequest -Uri "https://kauth.kakao.com/oauth/token" `
            -Method POST `
            -Headers @{"Content-Type" = "application/x-www-form-urlencoded"} `
            -Body $body
        $json = $res.Content | ConvertFrom-Json
        $newRefresh = if ($json.refresh_token) { $json.refresh_token } else { $tokens.refresh_token }
        Save-Tokens $json.access_token $newRefresh
        Write-Host "[OK] Token refreshed automatically"
        return $json.access_token
    } catch {
        Write-Host "[INFO] Auto-refresh not available, using stored token"
    }

    try {
        $check = Invoke-WebRequest -Uri "https://kapi.kakao.com/v2/user/me" `
            -Method GET `
            -Headers @{"Authorization" = "Bearer $($tokens.access_token)"}
        Write-Host "[OK] Stored token is valid"
        return $tokens.access_token
    } catch {
        Write-Host "[ERROR] Token expired. Please issue a new token at:"
        Write-Host "        https://developers.kakao.com/tool/rest-api/open/get/v2-user-me"
        return $null
    }
}

function Send-KakaoMessage($accessToken) {
    $today = Get-Date -Format "yyyy.MM.dd"
    $time  = Get-Date -Format "HH:mm"

    $templateObj = @{
        object_type  = "list"
        header_title = "[ETF] $today AM Report"
        header_link  = @{ web_url = "https://finance.naver.com"; mobile_web_url = "https://finance.naver.com" }
        contents     = @(
            @{
                title       = "ACE USA ETF"
                description = "S&P500(360750) / NASDAQ100(367380)"
                link        = @{ web_url = "https://finance.naver.com/item/main.naver?code=360750"; mobile_web_url = "https://finance.naver.com/item/main.naver?code=360750" }
            },
            @{
                title       = "ACE KR ETF"
                description = "KOSPI200(152100) / KOSDAQ150(229200)"
                link        = @{ web_url = "https://finance.naver.com/item/main.naver?code=152100"; mobile_web_url = "https://finance.naver.com/item/main.naver?code=152100" }
            },
            @{
                title       = "Send Time"
                description = "$today $time - Claude Auto Report"
                link        = @{ web_url = "https://finance.naver.com"; mobile_web_url = "https://finance.naver.com" }
            }
        )
        buttons      = @(
            @{
                title = "Naver Finance"
                link  = @{ web_url = "https://finance.naver.com"; mobile_web_url = "https://finance.naver.com" }
            }
        )
    }

    $templateJson = $templateObj | ConvertTo-Json -Depth 10 -Compress
    $body = "template_object=" + [System.Uri]::EscapeDataString($templateJson)

    try {
        $res = Invoke-WebRequest `
            -Uri "https://kapi.kakao.com/v2/api/talk/memo/default/send" `
            -Method POST `
            -Headers @{
                "Authorization" = "Bearer $accessToken"
                "Content-Type"  = "application/x-www-form-urlencoded"
            } `
            -Body $body
        $result = $res.Content | ConvertFrom-Json
        if ($result.result_code -eq 0) {
            Write-Host "[OK] KakaoTalk sent: $today $time"
        } else {
            Write-Host "[WARN] Response: $($res.Content)"
        }
    } catch {
        Write-Host "[ERROR] Send failed: $_"
    }
}

Write-Host "=== ETF Report $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') ==="
$tokens = Load-Tokens
if (-not $tokens) { Write-Host "[ERROR] Token file not found."; exit 1 }

$accessToken = Get-ValidToken $tokens
if (-not $accessToken) { exit 1 }

Send-KakaoMessage $accessToken
Write-Host "=== Done ==="
