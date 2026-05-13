# Claude Code 환경설정 가이드 (Windows)

> 작성일: 2026-05-12  
> 목적: 교육 수강 후 개인 노트북에서 Claude Code + MCP 환경 재현

---

## 1단계 — 사전 준비 프로그램 설치

### 1-1. Node.js 설치
1. https://nodejs.org 접속
2. **LTS 버전** 다운로드 (왼쪽 버튼)
3. 설치 후 확인:
```powershell
node -v
npm -v
```
두 명령 모두 버전 번호가 나오면 성공

### 1-2. VS Code 설치 (선택, 권장)
1. https://code.visualstudio.com 접속
2. **Windows용 다운로드** 클릭 후 설치

### 1-3. Claude Code VS Code 확장 설치
1. VS Code 실행
2. 왼쪽 확장 아이콘 클릭 (네모 4개 모양)
3. `Claude Code` 검색 → 설치
4. VS Code 재시작

---

## 2단계 — Claude Code CLI 설치

PowerShell(관리자)에서 실행:
```powershell
npm install -g @anthropic-ai/claude-code
```

설치 확인:
```powershell
claude --version
```

---

## 3단계 — Claude 계정 로그인

```powershell
claude
```
처음 실행 시 브라우저가 열리며 로그인 요청 → Anthropic 계정으로 로그인 (Pro 플랜 필요)

---

## 4단계 — MCP 서버 설정

### 4-1. Puppeteer MCP (Chrome DevTools MCP)

**Puppeteer MCP란?**
Claude Code가 Chrome 브라우저를 직접 조작할 수 있게 해주는 MCP 서버.
웹사이트 접속, 클릭, 입력, 스크린샷, 데이터 추출 등을 자동화할 수 있다.

**할 수 있는 것들:**
- 웹사이트 자동 접속 및 탐색
- 특정 요소 클릭 / 텍스트 입력
- 스크린샷 촬영
- 웹 스크래핑 (뉴스, 상품 정보, 가격 등)
- JavaScript 실행으로 DOM 데이터 추출
- 로그인된 상태로 페이지 조작 (Chrome 디버깅 모드 연동 시)

**설치:**
```powershell
claude mcp add puppeteer -- npx -y @modelcontextprotocol/server-puppeteer
```

### 4-2. Notion MCP
```powershell
claude mcp add notion -- npx -y @notionhq/notion-mcp-server
```

### 4-3. GitHub MCP
```powershell
# GitHub Personal Access Token 발급 후:
claude mcp add github -e GITHUB_PERSONAL_ACCESS_TOKEN=ghp_... -- npx -y @modelcontextprotocol/server-github
```

---

## 5단계 — Notion Integration 설정

1. https://www.notion.so/my-integrations 접속
2. **새 Integration 만들기** 클릭
3. 이름 입력 (예: `Claude MCP`)
4. **제출** → 토큰 복사 (`ntn_...` 형태)
5. Notion 페이지에서 우측 상단 `...` → **연결** → 만든 Integration 선택

---

## 6단계 — Chrome 디버깅 모드 설정

```powershell
Stop-Process -Name chrome -Force
Start-Process "C:\Program Files\Google\Chrome\Application\chrome.exe" -ArgumentList "--remote-debugging-port=9222 --user-data-dir=C:\Users\사용자명\AppData\Local\Google\Chrome\User Data"
```

연결 확인: 브라우저에서 `http://localhost:9222` 접속

---

## 활용 예시

| 작업 | 명령 예시 |
|------|----------|
| 뉴스 검색 | "네이버에서 한국전력공사 최신 뉴스 검색해줘" |
| Notion 저장 | "검색 결과를 Notion에 저장해줘" |
| GitHub 관리 | "저장소 만들고 파일 올려줘" |
| ETF 리포트 | "오늘 ETF 현황 카카오톡으로 보내줘" |

---

*이 가이드는 2026-05-12 Claude Code 교육 기반으로 작성되었습니다.*
