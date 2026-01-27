---
title: "C++ random_device"
date: 2025-12-28
categories: [C++]
tags: [c++, cpp, random_device, mt19937]
---

## 기본 사용

```cpp
#include <random>

// ...

std::random_device seed;
std::mt19937 generator(seed());

auto rNumber = generator();

// ...
```

- `<random>` 헤더를 통해 random_device를 초기화 하고 mt19937(유사 난수 생성기)를 해당 random_device로 초기화 함
- mt19937에는 `operator()`가 정의 되어있으며 호출만 하면 난수가 생성이 됨

## random number distribution

### 정수 균등 분포 생성

```cpp
#include <random>

// ...

std::random_device seed;
std::mt19937 generator(seed());
std::uniform_int_distribution<> dis(0, 100); // inclusive 0 and 100

for(int i=0;i<100;++i)
	auto num = dis(gen); // 0부터 100까지 균등한 확률로 생성됨

// ...

```

- `uniform_int_distribution`을 통해 균등 분포된 값을 생성할 수 있음

### 정수 정규 분포 생성

````cpp
```cpp
#include <random>

// ...

std::random_device seed;
std::mt19937 generator(seed());
std::normal_distribution<> dis(50, 10); // mean 50, stddev 10

for(int i=0;i<100;++i)
	auto num = dis(gen); // 100 개의 난수가 평균 50이 나오도록 표준편차 10으로 생성됨

// ...
````

- `normal_distribution`을 통해 정규 분포된 값을 생성할 수 있음

### 실수 균등 분포 생성

```cpp
#include <random>

// ...

std::random_device seed;
std::mt19937 generator(seed());
std::uniform_real_distribution<> dis(-100, 100); // inclusive -100 and 100

for(int i=0;i<100;++i)
	auto num = dis(gen); // double 타입의 값을 return 함
// ...
```

- `uniform_real_distribution`을 통해 균등 분포 된 실수 값을 생성할 수 있음

### 실수 정규 분포 생성

```cpp
#include <random>

// ...

std::random_device seed;
std::mt19937 generator(seed());
std::normal_distribution<double> dis(0, 8); // mean 0, stddev 8

for(int i=0;i<100;++i)
	auto num = dis(gen); // double 타입의 값을 return 함
// ...
```

- `normal_distribution`의 타입 명시를 통해 정규 분포된 실수 값을 생성할 수 있음
