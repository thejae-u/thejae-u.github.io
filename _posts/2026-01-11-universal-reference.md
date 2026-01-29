---
title: "보편참조"
date: 2026-01-11
categories: [C++]
tags: [c++, cpp, references, universal references, 보편참조]
---

- 상황에 따라 lvalue 참조가 되기도 하고, rvalue 참조가 되기도 하는 `T&&` 형태의 참조
- 무조건 rvalue 참조인 일반적인 `T&&` 와 다르게 템플릿 타입 추론이 개입할 때만 성립하는 개념
- 조건을 만족하는 `T&&`에 대해 인자에 따라 다음과 같이 동작함
  - lvalue 전달 시 : `T`가 `U&`로 추론되고, 매개변수 타입은 `U& &&` -> 참조 축약으로 `U&` (lvalue 참조)
  - rvalue 전달 시 : `T`가 `U`로 추론되고, 매개변수 타입은 `U&&` (rvalue 참조)

## 대표적인 패턴

```cpp
template <typename T>
void Func(T&& val); // val은 보편참조 가능
```

- 함수 템플릿 매개변수

```cpp
auto&& val = expr; // var는 보편참조
```

- `auto&&` 변수

## 보편 참조가 아닌 경우

- `T&&` 가 모두 보편 참조인 것은 아님
- 다음의 경우는 모두 보편참조가 아님

```cpp
void Func(Widget&& val); // 템플릿이 아님 -> rvalue 참조

template <typename T>
void Func(std::vector<T>&& val); // T는 추론됨 그러나 val 타입 형태가 T&&가 아님 -> rvalue 참조

template <typename T>
void Func(const T&& val); // const T&& -> rvalue 참조
```

## 예제 코드

```cpp
#include <iostream>
#include <type_traits>
template <typename T> void Func(T&& val) // Universal reference
{
	if(std::is_rvalue_reference<decltype(val)>::value)
		std::cout << "value is r value\n";
	else if(std::is_lvalue_reference<decltype(val)>::value)
		std::cout << "value is l value\n";
}
int main()
{
	Func(3);
	int x=10;
	Func(x);
}
```

```bash
출력 결과
value is r value
value is l value
```
