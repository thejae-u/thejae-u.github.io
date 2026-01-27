---
title: "스마트 포인터 순환 참조 문제"
date: 2025-12-27
categories: [C++]
tags: [C++, 스마트포인터, memory, 순환참조]
---

- 개인 프로젝트를 진행하면서 안전한 포인터 사용을 위해 스마트 포인터를 사용하였지만 사용 미숙으로 인해 `shared_ptr`의 상호 참조 문제가 발생하였다
- 메모리가 해제되지 못하고 끝까지 남아있는 것을 발견하고 해당 문제를 해결하게 되었다

## 문제점

- shared_ptr은 하나의 메모리를 여러 객체가 공유하고자 할 때 사용할 수 있음
- 당연하게도 `A`라는 클래스에 대한 shared_ptr을 `B`라는 클래스의 객체가 소유할 수 있음

```cpp
Class A
{
public:
	A() {}
	std::shared_ptr<B> b;
};

Class B
{
public:
	B() {}
	std::shared_ptr<A> a;
}

int main()
{
	auto a = std::make_shared<A>();
	auto b = std::make_shared<B>();

	// 서로 참조 횟수 증가
	a->b = b;
	b->a = a;
}
```

- 위와 같은 코드는 shared_ptr의 잘못된 사용의 예시임
- A 가 B 에 대한 shared_ptr을 소유하고 B 가 A 에 대한 shared_ptr을 소유하는 순환 참조 문제가 일어남
- shared_ptr은 참조 카운트를 내부적으로 가지고 있으며 참조 카운트가 0이 될 경우 소멸하는 로직을 가지고있음
- 결론적으로 객체가 소멸되어야 할 타이밍에 소멸되지 못하고 메모리 누수가 발생함

## 해결 방법

- 순환 참조가 일어날 가능성이 있는 구조에서는 `weak_ptr`을 사용하여 소유권을 가지지 않도록 해야함

```cpp
class A
{
public:
	A() { std::cout << "Created A\n"; }
	~A() { std::cout << "Destroyed A\n"; }
	std::weak_ptr<B> b;
};

class B
{
public:
	B() { std::cout << "Created B\n"; }
	~B() { std::cout << "Destoryed B\n"; }
	std::weak_ptr<A> a;
};

int main()
{
	auto a = std::make_shared<A>();
	auto b = std::make_shared<B>();

	a->b = b;
	b->a = a;
}
```

- weak_ptr로 공유를 받게 될 경우 참조 카운트를 증가시키지 않고 shared_ptr의 weak 카운트를 증가시키며 이는 객체의 소멸 조건에 영향을 주지 않음
  - 결론적으로 참조 카운트는 0이 되며 안전하게 소멸자를 호출함

## shared_ptr의 구조

- shared_ptr은 메모리 블록에 실제 데이터 메모리 영역과 이를 관리하는 컨트롤 블록(Control Block)영역으로 나뉨
- 이때 컨트롤 블록은 참조 카운트, weak 카운트 (약한 참조), 객체 소멸자 포인터 등 해당 메모리를 관리하기 위한 정보들로 이루어져있음
- 참조 카운트가 0이 되면 객체는 소멸함, 그러나 weak 카운트가 0이 아니라면 컨트롤 블록은 소멸하지 않음
  - 소멸 체크를 위한 로직

```cpp
auto a = std::make_shared<A>();

// 여기서 자동으로 약한 참조
std::weak_ptr<A> weakA = a;
if(auto sharedA = weakA.lock())
{
	sharedA->DoSomething();
}
```

- 위와 같은 방식으로 shared_ptr로 초기화 된 a 객체에 대해서 약한 참조를 할 때 `lock()`을 통해 객체가 유효한지 확인 할 수 있으며 `lock()`은 shared_ptr을 반환함
