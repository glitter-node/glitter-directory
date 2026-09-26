# Glitter Directory

Glitter Directory (`glitter-directory`)는 기존 Gnuboard 7 게시판 콘텐츠를 디렉터리와 카탈로그 목록처럼 보여주는 Seed User Template입니다. 초기 버전은 Directory discovery, Category browse, Board-scoped search, Listing results, Listing detail을 제공하는 데 집중합니다.

## 누구를 위한 템플릿인가

게시판을 문서 리더가 아니라 항목 목록으로 보여주고 싶은 사이트를 위한 시작점입니다. 공개 게시판을 Directory로 발견하고, 카테고리와 검색어로 Listing을 찾은 뒤 상세 내용을 확인하는 흐름을 제공합니다.

```text
G7 Board       → Directory
G7 Category    → Category
G7 Post        → Listing
G7 Post Detail → Listing Detail
```

Seed User Template이라는 의미는 제품별 Directory 데이터를 새로 관리한다는 뜻이 아니라, G7의 기존 콘텐츠를 다른 정보 구조와 화면으로 재사용하는 출발점이라는 뜻입니다. 템플릿을 제거하거나 교체해도 Board, Category, Post 원본은 그대로 남습니다.

## 제공 기능

- Directory Home에서 공개 가능한 Board 발견
- Directory identity와 description 표시
- 실제 Board Category 기반 카테고리 탐색
- Board-scoped search
- Category + search query 조합
- Explorer controls for search, category, semantic sorting, view mode, and pagination
- Listing detail breadcrumb와 context return
- sirsoft-board가 제공하는 Previous/Next 재사용
- text 및 HTML content의 안전한 표시
- G7 공통 theme preference의 System, Light, Dark 표시
- G7 공통 theme preference를 사용하는 header
- G7 Core 인증 상태를 반영하는 Guest/Authenticated account navigation
- Core auth API를 사용하는 Directory 로그인·회원가입 화면
- Core `/api/me`와 `/api/me/password`를 사용하는 Account 화면
- Responsive Desktop, tablet, and mobile layout
- Semantic navigation and focus-visible states

Directory는 Knowledge의 Reader 중심 IA를 복제하지 않습니다. TOC, reading progress, current section tracking, documentation 전용 navigation은 포함하지 않습니다.

## 원본 콘텐츠와 backend 경계

G7 Core와 `sirsoft-board`가 Board, Category, Post, 인증, 권한, 공개 여부, 검색, pagination, content mode를 소유합니다. Glitter Directory는 Information Architecture, Presentation, Content Adapter, Discovery UX만 담당합니다.

템플릿의 KO/EN 사전은 메뉴, 안내, 결과 요약 등 템플릿 소유 UI에만 적용됩니다. Board 이름과 설명, Category, Post, 계정 값은 API가 반환한 그대로 표시합니다. `sirsoft-board`가 locale별 Board 이름·설명을 반환하거나 누락된 번역을 fallback하면, 템플릿은 그 API 결과를 사용하며 콘텐츠를 자체 번역하지 않습니다.

이 템플릿에는 다음이 없습니다.

- Directory, Listing, Category 전용 DB
- 별도 authentication 또는 permission backend
- 독립 search engine
- review, rating, reservation, commerce, payment
- location/geocoding, favorites, recommendation
- workflow, collaboration, AI/RAG
- faceted filter, price, distance, tags, opening hours

실제 `sirsoft-board` API가 제공하지 않는 address, price, rating, phone, location 같은 필드는 표시하지 않습니다. Thumbnail도 Post resource가 제공하는 `thumbnail` 값이 있을 때만 사용합니다.

## 첫 사용 방법

1. Glitter Directory를 설치하고 활성화합니다.
2. G7 관리자에서 공개 읽기 권한이 있는 게시판을 준비합니다.
3. 필요한 경우 Board Category를 등록합니다.
4. Board Post를 작성합니다. `text` 본문은 평문으로, `html` 본문은 sanitizer를 거친 HTML로 표시됩니다.
5. `/directory`에서 Directory를 발견하고, `/directory/{slug}`에서 Listing을 탐색합니다.

특정 Board, Post, User, Domain은 템플릿에 하드코딩하지 않습니다.

## Auth / Account

G7 Core가 authentication, session, permission, account backend capability를 소유합니다. Glitter Directory는 그 Core API를 사용하는 browser presentation/navigation만 제공합니다. `/login`, `/register`, `/account`는 Directory의 thin presentation route이며, 별도 auth DB, session system, permission system, account backend를 만들지 않습니다.

## Optional Glitter Translate integration

Glitter Translate (`glitter-translate`)는 필수 의존성이 아닌 선택적 보강 기능입니다. 활성화되어 있으면 Directory Listing Detail이 현재 G7 locale에 대한 permission-aware public resolver를 조회하고, current translation이 있을 때 title과 content를 표시합니다. Plugin이 없거나 비활성화되어 있거나 resolver를 사용할 수 없거나 번역이 missing/stale/orphaned이면 원본 `sirsoft-board` Post 값을 사용합니다.

- `sirsoft-board`는 계속해서 필수 source/Post 의존성입니다.
- Listing Card는 페이지 단위로 Glitter Translate Batch Resolver를 한 번 호출하여 current title translation을 사용할 수 있습니다. Plugin이 없거나 요청이 실패하면 원본 title을 사용합니다.
- Listing Card integration은 title만 번역하며 content preview와 category는 원본 값을 유지합니다.
- Search는 기존 `sirsoft-board` 검색 색인을 사용하며 translated search는 지원하지 않습니다.
- Category translation과 automatic translation은 지원하지 않습니다.
- Post ownership은 계속 `sirsoft-board`에 있습니다.

## 지원 범위와 확장 경계

초기 탐색은 Directory, Category, Search query, Sorting, Pagination으로 제한합니다. 구조화된 listing 속성이나 소유권 검증이 필요해지면 Template에서 임의로 확장하지 않고 Module 후보로 검토해야 합니다. Directory 원본 데이터를 관리하는 CMS, 전역 검색, 추천, 즐겨찾기, commerce 기능도 향후 Module 영역입니다.

## 기술 참고

Bundled source가 source of truth입니다.

```text
templates/_bundled/glitter-directory/src
        ↓ static build
templates/_bundled/glitter-directory/dist
        ↓ official template lifecycle
installed template
```

`dist`와 installed template은 생성·배포 결과이므로 직접 수정하지 않습니다. 개발 서버나 HMR은 지원하지 않으며 `npm run type-check`, `npm run build`, 필요 시 `npm run build:watch`를 사용합니다.

## License

MIT. Copyright (c) 2026 Glitter.kr.
