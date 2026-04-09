---
title: "Connection Pool"
date: 2026-04-09
categories: [Server]
tags: [tcp, connection pool, network, server]
---

## Connection Pool
- 매 요청마다 새 TCP 연결을 만들지 않고, 미리 만들어 둔 연결들을 빌려쓰고 반납하는 구조
- `ThreadPool`과 같이 생성에 비용이 큰 객체를 미리 만들어 사용하는 것을 목표로 함

## 구조

![connection-pool-structure](/assets/images/posts/2026-04-09-connection-pool/connection-pool-structure.png){: width="800"}

- 클라이언트 측에서 로직 서버로 DB 요청을 하면 로직 서버는 인증 서버와 미리 연결 된 TCP Connection을 Pool에서 받아 해당 Conection으로 로직을 처리
- 완료된 처리에 대해서는 마무리 작업 후 다시 Connection Pool로 반환
- 로직 서버는 `GetConnection()`과 `ReturnConnection()`과 같은 로직이 구현되어야 함

## 동작 방식
1. 애플리케이션 시작 시 연결 여러 개를 생성
2. 요청이 오면 풀에서 idle connection 하나를 가져옴
3. 작업이 끝나면 닫지 않고 풀에 반환
4. 풀이 비어 있으면 새 연결을 만들거나 일정시간 대기 후 실패 처리

## Pool 사용 이점
- 미리 연결된 TCP를 사용하기에 실시간 DB 요청이 많은 상황에서 비용이 큰 연결 과정을 제외하고 처리가 가능
- 처리 시간에 대한 시간적 이점이 생김

## Pool 관리 방법

### Pool 최대 개수
- 풀이 최대로 가질 수 있는 연결 개수로`활성 연결 + 대기 연결`은 이 값을 넘길 수 없음
- 풀이 너무 크면 서버 리소스의 부담이 커짐 -> 적정 개수 유지를 위한 테스트 필요
	- 서비스의 규모를 파악하는 것이 1순위
	- 예) thread/worker 개수와 요청 패턴에 맞춤

### Pool 대기 시간
- 풀이 이미 전부 사용 중 일때, 새로운 요청에 대한 최대 대기 시간
- 이 시간을 넘기면 `timeout`과 같은 예외로 처리함
- 시간의 적절한 설정이 필요함
	- 너무 짧으면 트래픽이 몰릴 시 유저에게 에러가 빈번하게 발생함
	- 너무 길면 유저 체감 레이턴시가 증가함
- 일반적으로 DB 풀은 **2초 ~ 30초** 사이에서 설정하는 경우가 많음
- 게임서버의 경우 **2000ms ~ 5000ms** 정도로 짧게 설정하고, 에러/재시도 및 재연결을 하도록 설계

### Pool 유휴 연결 및 유휴 시간
> 유휴 연결 : 네트워크나 데이터베이스에서 세션이 맺어져 있으나, 실제 데이터 전송 없이 대기 상태인 연결

#### 유휴 연결 수
- 풀이 최소로 유지할 유휴 연결 개수
	- `minimumIdleSize` <= `maximumPoolSize`
- 풀이 항상 비어 있는 상태를 회피, 초기 요청에 대한 레이턴시를 줄임
- 로직 상 항상 바쁜 상태라면 `minimunIdleSize`를 `maximumPoolSize`와 같게 두는 편이 좋음
	- `minimumIdleSize < maximumPoolSize`라는 가정 하에 Idle의 개수가 `minimumIdleSize`를 넘으면 풀 정리를 해야하기 때문

#### 유휴 연결 시간
- 연결이 사용되지 않고 방치된 시간이 이 값만큼 지나면 풀을 정리함(`Close()`)
	- 예) `idleTimeout = 300,000(5m)` -> 5분 동안 아무도 안쓰면 연결 종료
- 너무 길게 두면 필요 없는 연결이 오래 남아 FD 자원 낭비로 이어짐
- 너무 짧게 두면 자주 연결이 종료되어 필요 할 때마다 Handshake 비용 발생
- 일반적으로 **5분 ~ 10분**정도로 설정
