# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


## 4. 역할 분담

### 🌱 오주경 (Frontend)

#### UI

**페이지**
- 로그인
- 회원가입
  - 개인정보 동의
  - 개인정보 입력
  - 가입 완료 안내
- 아이디 / 비밀번호 찾기
  - 계정 정보 찾기
  - 안내 페이지

#### 기능
- 로그인 및 회원가입 화면 UI 구현
- 개인정보 입력 및 동의 화면 구성
- 아이디 / 비밀번호 찾기 흐름에 따른 화면 분기 처리
- 사용자 입력 흐름에 맞춘 안내 페이지 구현

---

## 7. 페이지별 기능

### [로그인]
- 이메일(아이디)과 비밀번호 입력 UI 제공
- 입력값에 따라 로그인 버튼 활성화 처리
- 로그인 성공 시 메인 페이지로 이동
- 로그인 실패 시 안내 메시지 표시

---

### [회원가입]

**개인정보 동의**
- 필수 개인정보 수집 및 이용 동의 화면 구성
- 동의 여부에 따라 다음 단계 진행 가능 여부 제어

**개인정보 입력**
- 회원가입에 필요한 기본 정보 입력 UI 구현
- 입력 값에 따른 버튼 활성화 처리

**가입 완료 안내**
- 회원가입 완료 후 안내 화면 제공
- 로그인 페이지로 자연스럽게 이동할 수 있도록 구성

---

### [아이디 / 비밀번호 찾기]

**찾기 페이지**
- 아이디 또는 비밀번호 찾기를 위한 입력 UI 제공
- 사용자의 선택에 따라 안내 페이지로 이동

**안내 페이지**
- 계정 정보 확인 결과에 따른 안내 메시지 제공
- 로그인 화면으로 돌아갈 수 있는 버튼 제공

---

## 10. 프로젝트 후기

🌱 **오주경**

이번 프로젝트는 처음으로 프론트엔드 개발을 직접 경험해본 프로젝트였습니다.  
처음 해보는 것들이 많아 전반적으로 어설프고 미숙한 부분도 있었지만, 직접 화면을 만들고 하나의 서비스 흐름을 구성해보는 경험을 할 수 있어 뜻깊은 시간이었습니다.

로그인과 회원가입처럼 사용자가 처음 접하게 되는 화면을 맡으면서  
단순히 화면을 구현하는 것뿐만 아니라, 사용자가 어떤 순서로 정보를 입력하고 어떤 안내가 필요할지 고민해볼 수 있었습니다.

아직 부족한 점이 많지만, 이번 프로젝트를 통해 프론트엔드 개발의 전체적인 흐름을 이해할 수 있었고 앞으로 더 배우고 성장해 나가고 싶다는 생각을 하게 되었습니다. 감사합니다.

