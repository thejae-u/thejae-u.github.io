---
title: "Tag Dispatching과 Passkey Idiom"
date: 2026-01-11
categories: [C++]
tags: [tag dispatching, passkey idiom, c++, cpp, private tag]
---

## Tag Dispatching

### 정의

- C++에서 함수 오버로딩과 템플릿을 활용해 타입이나 속성에 따라 다른 구현을 호출하는 메타프로그래밍 패턴
- 함수 인자로 태그(빈 구조체나 클래스)를 전달하여 컴파일러가 오버로드 된 함수들 중에서 적합한 구현을 선택하도록 함

### 예시

```cpp
#include <iostream>
#include <vector>
#include <list>
#include <iterator>

template <typename Iter>
void FuncImpl(Iter& it, int n, std::random_access_iterator_tag)
{
	std::cout << "O(1) Access\n";
	it += n;
}

template <typename Iter>
void FuncImpl(Iter& it, int n, std::bidirectional_iterator_tag)
{
	std::cout << "O(N) Access\n";
	for (int i = 0; i < n; ++i)
		++it;
}

template <typename Iter>
void Func(Iter& it, int n)
{
	FuncImpl(it, n, typename std::iterator_traits<Iter>::iterator_category {});
}


int main()
{
	std::vector<int> v = { 1, 2, 3, 4, 5 };
	auto vIt = v.begin();

	Func(vIt, 3);
	std::cout << "value: " << *vIt << '\n';

	std::list<int> l = { 1, 2, 3, 4, 5 };
	auto lIt = l.begin();

	Func(lIt, 3);
	std::cout << "value: " << *lIt << '\n';
}
```

- `FuncImpl`에서 `std::random_access_iterator_tag`나 `std::bidirectional_iterator_tag`와 같은 빈 구조체를 매개변수로 받음
- 컴파일 시점에 `iterator_traits<Iter>::iterator_category{}`를 통해 타입에 대한 함수가 연결됨
- 결과적으로 if 문 없이 태그를 통해 내부적으로 적절한 함수에 연결(Dispatch)하게 됨

### C++ 17

```cpp
template <typename Iter>
void Func(Iter& it, int n)
{
	if constexpr (std::is_same_v<typename std::iterator_traits<Iter>::iterator_category, std::random_access_iterator_tag>)
	{
		it += n;
	}
	else
	{
		for(int i = 0; i < n; ++i)
			++it;
	}
}
```

- C++ 17 이상부터는 태그 디스패칭을 직접 구현하지 않고 `if constexpr`을 통해 컴파일 시점에서 적절한 함수로 매핑되도록 할 수 있음
- 태그 디스패칭처럼 함수 오버로딩으로 인한 코드 가독성을 해치는 일이 없으며 디버깅에 유리한 장점이 있다

## Passkey Idiom (private tag)

### 사용방법

- 스마트 포인터를 사용함과 동시에 정해진 생성 규칙을 따르도록 강제하는 방법 중 하나

```cpp
class A
{
private:
	struct SecretKey {};
public:
	explicit A(SecretKey)
	{
		std::cout << "Make A by Secret Key\n";
	}

	static auto Create()
	{
		auto newA = std::make_shared<A>(SecretKey{});
		return newA;
	}

private:

};

int main()
{
	auto validA = A::Create(); // 정상 작동
	auto invalidA = new A(); // 컴파일 에러
}
```

- 생성자는 Tag용 빈 구조체 `SecretKey`을 매개변수로 받아 외부에서 생성자를 직접 호출 할 수 없도록 함
- 사용자는 `A`클래스의 `Create`함수만을 통해 `A`객체를 생성할 수 있음

### 주의점

- 스마트 포인터의 `make_shared`, `make_unique`는 `A` 클래스에 대해 외부 함수이므로 `new` 호출을 통해 포인터를 생성하도록 설계되어 있음
- 이때, `A`클래스의 생성자를 `private`영역으로 옮기게 되면 스마트포인터 생성 과정에서 접근제한 오류가 발생함

### 결론

- 따라서 explicit 키워드와 빈 private tag를 통해 생성자를 외부로 노출시키되 직접 호출하지 못하도록 함
