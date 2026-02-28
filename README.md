# croo12 (WebAssembly & FSD Vite Game)

이 프로젝트는 브라우저(WebAssembly) 환경의 게임을 구동하기 위한 확장성 있는 프론트엔드 레포지토리 빌드 뼈대입니다.

## 아키텍처 개요 (Single Vite + FSD)

다양한 기능 확장에 유연하게 대처하기 위해, **Vite** 빌드 시스템 기반에 **FSD (Feature-Sliced Design)** 아키텍처를 적용했습니다.

### 주요 폴더 구조
- `core/` : C++, Rust, Go 등 하위 언어로 게임의 심장(메인 로직)을 개발하고 `.wasm`으로 빌드하기 위한 독립적인 백엔드성 공간입니다. 프론트엔드 환경에 전혀 의존하지 않습니다.
- `src/` : 게임 화면과 UI를 렌더링하는 프론트엔드 코드(FSD 구조)가 위치합니다.
  - `app/` : 진입점(`main.ts`), 글로벌 스타일(`global.css`), 라우터 설정 등 전체 앱의 전역 공간입니다.
  - `pages/` : 화면 단위 (예: 메인 화면, 인게임 화면, 엔딩 화면 등)
  - `widgets/` : 여러 컴포넌트를 조합하여 만든 덩어리형 UI (예: 게임 HUD, 리더보드 등)
  - `features/` : 사용자의 행동 단위 (예: 게임 시작하기, 점수 저장하기 등)
  - `entities/` : 비즈니스/게임 모델 도메인 (예: Player, Enemy, GameState 상태 보관 및 타입 정의)
  - `shared/` : 가장 하위의 공통 유틸리티 공간.
    - `ui/` : 범용 UI 컴포넌트(버튼 등)
    - `wasm/` : `core/`에서 나온 `.wasm` 파일을 로드하는 Wrapper 모듈
    - `assets/` : 이미지, 사운드(SFX, BGM), 3D 모델(GLTF 등)
    - `lib/` : 순수 유틸(Math, Logging 등)

## 개발 및 테스트 방법 (로컬 환경)

Vite 개발 서버를 사용하므로 `.wasm` 로드 시의 MIME 타입이나 CORS 문제가 자동으로 해결됩니다.

1. 의존성 패키지 설치:
   ```bash
   npm install
   ```
2. 로컬 개발 서버(Dev Server) 실행 (HMR 지원):
   ```bash
   npm run dev
   ```
3. 브라우저에서 터미널에 나온 로컬 주소(예: `http://localhost:3000`)로 접속하면 실시간으로 코드를 테스트할 수 있습니다.

## 배포 (Production Build)

GitHub Pages 등 정적 호스팅에 배포하기 위해서는 빌드가 필요합니다:
```bash
npm run build
```
빌드가 완료되면 `dist/` 폴더에 생성된 정적 파일들을 GitHub Pages로 서빙하면 됩니다.
