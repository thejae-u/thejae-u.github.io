---
title: "IL evaluation stack"
date: 2026-05-07
categories: [C#]
tags: [C#, CSharp, IL]
---

- IL evaluation stack (이하 평가 스택)은 CLR 가상 머신의 임시 스택으로 명령어 연산자/인자 전달을 목적으로 존재함

- asm 과 비교하자면 asm이 실제 메모리 영역에 저장을 하고 레지스터를 사용하여 데이터 이동을 하는 반면, IL 은 레지스터 없이 stack의 top 에서만 작업이 이루어짐

## IL 분석

```cs
IL_0000: ldarg.1
IL_0001: ldarg.2
IL_0002: ldarg.3
IL_0003: call Foo
```

- IL 코드 해석
  - `IL_0000 ~ IL_0002` 까지 평가 스택에 매개변수 1, 2, 3을 push (여기서 arg.0은 this)
  - `IL_0003` 에서 `Foo` 를 실행하여 평가 스택의 모든 인자 소비 (pop)
- 평가 스택은 실제 메모리 영역이 아닌 **CLR의 임시 연산 스택** 으로 `ldarg` 연산은 메모리에서 값을 읽어 평가 스택 top에 넣음

## 정리

- asm의 `push` + `call` 또는 레지스터 전달은 실제 메모리 스택과 레지스터를 사용하는 방식이며 같은 레지스터를 반복 사용해도 한 개만 존재함
- IL의 `ldarg` + `call` 은 가상 머신의 평가 스택에서 인자를 전달하는 방식
  - `ldarg.1` 을 여러번 사용하면 평가 스택에 값이 여러개 쌓임
- IL은 Stack-based VM, asm은 Register-based + Stack의 혼합 방식으로 차이가 존재함

## 개인적인 생각

- IL과 ASM을 비슷하게 보고 있었는데 전혀 다르게 생각해야 한다는 것을 알아버렸다.
- ASM에 대해서도 아직 많이 부족하니 조금씩 알아가야겠다.
