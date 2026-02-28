# 프로젝트 논의 요약 (GitHub Pages & WebAssembly Game)

본 문서는 GitHub Pages를 활용한 웹 게임 서비스 가능 여부와 기술적 특징, 그리고 WebAssembly 적용에 대해 논의한 내용을 요약한 것입니다.

## 1. GitHub Pages(깃허브 블로그) 특징

GitHub Pages는 기본적으로 **'정적 웹사이트 호스팅'** 서비스입니다.

### 🟢 가능한 것 (장점)
- **무료 호스팅 및 도메인:** 평생 무료 호스팅(`username.github.io`) 제공 및 커스텀 도메인 연결.
- **HTTPS 지원:** 무료 SSL 인증서 자동 갱신.
- **프론트엔드 완벽 지원:** HTML, CSS, JavaScript(React, Vue 등 포함) 실행. 마크다운(.md) 변환 기능 내장.
- **다양한 정적 사이트 생성기(SSG):** Jekyll은 물론 GitHub Actions 연동 시 Next.js(Export), Gatsby 등 사용 가능.

### 🔴 불가능한 것 (제한사항)
- **백엔드(서버 사이드) 실행 불가:** PHP, Node.js 서버, Python 연산 등 불가. (대안: 외부 API 호출 형태)
- **자체 DB 구축 불가:** MySQL 등 DB 미지원. (대안: Firebase 등 외부 BaaS 사용)
- **보안 데이터 은닉 불가:** 브라우저 환경에서 동작하므로 API 키 노출 위험성 존재.

## 2. GitHub Pages에서의 게임 제작

GitHub Pages의 프론트엔드 환경 특징을 활용해 **게임 제작과 서비스가 가능**합니다.

- **지원되는 게임 형태:**
  - 바닐라 JS, React 등을 활용한 캐주얼 2D 웹게임.
  - Phaser.js, Three.js 기반의 Canvas/WebGL 게임.
  - **Unity, Godot 등 상용 게임 엔진의 'Web Export' 빌드물 (WebGL 기반).**

- **극복해야 할 게임 환경적 한계:**
  - 실시간 멀티플레이(MMO 등)용 독자 게임 서버 운용 불가 → Firebase, Photon 등 외부망 연동 필요.
  - 유저별 데이터 세이브 기능 미지원 → 브라우저 localStorage 활용.

## 3. WebAssembly (Wasm) 지원 관련

최신 웹 표준 기술인 **WebAssembly(.wasm) 역시 완벽하게 지원**됩니다.

- 브라우저가 C, C++, Rust, Go 코드를 네이티브에 가까운 속도로 직접 연산 및 실행.
- GitHub 측에서 `.wasm` 파일에 대해 알맞은 MIME 타입(`application/wasm`)을 제공.
- Unity, Unreal 등의 웹 빌드 역시 WebAssembly 기술에 의존하며 원활하게 동작.

### ⚠️ WebAssembly 사용 시 주의점
- **파일 용량 제한 (중요!):** 단일 파일 용량 100MB 초과 불가, 전체 레포지토리 1GB 제한 (트래픽 월 100GB 한도). 고용량 대작 3D 게임엔 한계.
- **멀티스레딩(SharedArrayBuffer) 헤더 적용 제한:** WebAssembly 멀티스레딩을 사용하려면 특정 HTTP 헤더 세팅이 필요한데, GitHub Pages 서버 특성상 헤더 수정 불가. (대안: Service Worker를 통해 브라우저 단에서 우회 헤더 삽입 등).

## 4. 로컬 프로젝트 설정 완료 (croo12)

위 내용들을 바탕으로 현재 WebAssembly 웹 게임 테스트용 기본 프로젝트 세팅이 완료되었습니다.

- **프로젝트 명/경로:** `croo12` (`/home/croo12/croo12/`)
- 기본 Canvas 세팅 및 WebAssembly를 로드할 수 있는 빈 자바스크립트 구조가 들어가 있습니다.
- 개발 단계에서 브라우저 로컬 정책 병목을 피하기 위해 `http-server` 류의 로컬 포트를 통한 테스트를 권장합니다.
