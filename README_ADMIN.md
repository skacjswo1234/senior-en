# 관리자 페이지 설정 가이드

## 1. Cloudflare Pages 배포 설정

### D1 데이터베이스 바인딩
Cloudflare Pages 대시보드에서:
1. Settings > Functions > D1 Database bindings
2. Binding name: `senior-en-db`
3. Database: `senior-en-db` (ID: 5b79ef7c-5934-4a27-9eca-d490cdcd54fd)

## 2. 초기 관리자 계정 생성

D1 데이터베이스에 관리자 계정을 생성해야 합니다.

### Cloudflare 대시보드에서 SQL 실행:

```sql
INSERT INTO admin (username, password) 
VALUES ('admin', 'your_secure_password_here');
```

또는 wrangler CLI 사용:

```bash
wrangler d1 execute senior-en-db --command "INSERT INTO admin (username, password) VALUES ('admin', 'your_secure_password_here')"
```

## 3. 파일 구조

```
senior-en/
├── functions/
│   ├── api/
│   │   ├── submit.js      # 문의 제출 API
│   │   ├── login.js       # 로그인 API
│   │   ├── logout.js      # 로그아웃 API
│   │   └── inquiries.js   # 문의 내역 조회 API
│   └── admin/
│       └── [[path]].js    # 관리자 페이지 라우팅
├── index.html
├── script.js
├── style.css
└── wrangler.toml
```

## 4. 접근 경로

- **관리자 페이지**: `https://your-domain.pages.dev/admin`
- **API 엔드포인트**:
  - `/api/submit` - 문의 제출
  - `/api/login` - 로그인
  - `/api/logout` - 로그아웃
  - `/api/inquiries` - 문의 내역 조회

## 5. 보안 참고사항

현재 구현은 간단한 세션 기반 인증을 사용합니다. 프로덕션 환경에서는:
- 비밀번호 해싱 (bcrypt 등) 사용 권장
- JWT 토큰 기반 인증 고려
- HTTPS 필수
- CSRF 보호 추가 고려

## 6. 로컬 개발

```bash
# Wrangler 설치
npm install -g wrangler

# 로컬 개발 서버 실행
wrangler pages dev
```

