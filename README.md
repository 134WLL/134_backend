# 팀 빌딩을 위한 조직 내 대화 솔루션

## 배포 링크

- [134 서비스 링크](https://134.works)

## 서비스 개요
> 2023/04/25 ~
#### 프로젝트 주제
- 팀 빌딩을 위한 조직 내 대화에서, 상대를 심리적 또한 업무적으로 잘 성장 시킬 수 있는 코칭 리더십을 펼칠 수 있게 질문과 대화 서비스를 제공
#### 개발 목적
- 조직문화 개선, 퇴사율 방어, 소속감 증대
- 사람과 사람의 마음의 경계를 허물고, 서로 깊게 연결해주는 대화 주제와 질문 제공하는 saas 서비스

## 페이지 주요 기능
| 로그인 & 회원등록 & 닉네임 설정 페이지 | 대화 목록 페이지 |
|---|---|
|<img src="https://github.com/134talk/frontend/assets/101298873/4e32d35f-ce29-4a9e-9224-7692844e4634" width="380" />|<img src="https://github.com/134talk/frontend/assets/101298873/8745bd95-7602-49f1-a535-89964b2869b5" width="380"/>|
|▪︎ 카카오 소셜 로그인 <br /> ▪︎ 관리자, 일반 회원 권한별 회원 등록 <br /> ▪︎ 유효성 검사 <br /> ▪︎ 참가자 성향 조사 데이터에 따라 닉네임 제공 |▪︎ 권한별 대화 목록 조회 및 검색 <br /> ▪︎ 관리자 권한 대화 시간 설정 <br /> ▪︎ 대화 초대 모달을 통해 대화 생성 |

| 참가자 목록 페이지 | 대화 페이지 |
|---|---|
|<img src="https://github.com/134talk/frontend/assets/101298873/41f1242f-f7d1-422b-91db-97f0774e2703" width="380" />|<img src="https://github.com/134talk/frontend/assets/101298873/dedf4b32-de53-4762-8027-10dd340e0821" width="380"/>|
|▪︎ 참가자 목록 조회 및 검색 <br /> ▪︎ 카카오나 링크 공유를 통한 채널 초대 |▪︎ 대화방 입장 전 대화 가이드 제공 <br /> ▪︎ 참가자 성향에 맞는 랜덤 질문 set 제공 <br /> ▪︎ 주제 선택 ➢ 질문 순서 선택 ➢ 대화 참여 대기 <br /> ➢ 대화 순서 랜덤 배정 ➢ 대화 진행 <br /> ▪︎ 대화 참여 소켓 연결 및 랜덤 배정된 대화 컨텐츠 조회 <br /> ▪︎ 대화 진행 중 감정 기록 및 전송된 감정 애니메이션 노출 <br /> ▪︎ 대화 종료 후 피드백 작성|

| 리포트 페이지 | 마이 페이지 |
|---|---|
|<img src="https://github.com/134talk/frontend/assets/101298873/1a3e162e-aca8-442b-9937-39a246b71512" width="380" />|<img src="https://github.com/134talk/frontend/assets/101298873/dda37683-7b06-4fef-9b1a-8d76071ca97b" width="380"/>|
|▪︎ 팀 대화 통계 리포트 열람 <br /> ▪︎ 관리자 권한 팀원 대화 통계 리포트 열람| ▪︎ 프로필 조회 <br /> ▪︎ 닉네임 수정 <br /> ▪︎ 일자별 개인 대화 통계 리포트 열람 |

## 아키텍쳐
<img src="https://github.com/134talk/frontend/assets/101298873/5e26c459-ee16-47d8-93df-1f8705281af3" width="800">

## 기술 스택
- React, TypeScript
- React-Query, ReduxTK
- Socket.IO
- Axios
- Styled-Components

 ## 기타
 - [Convention](https://github.com/134talk/frontend/issues/1)
 - [Directory](https://github.com/134talk/frontend/issues/2)
 - [UserFlow](https://www.figma.com/file/NnApm0KFSnMFfcuEpLmyug/Untitled?type=design&node-id=0%3A1&mode=design&t=E3Y2ovnh8mFhcxcv-1)
