var store = [{
        "title": "FMOD Unity .gitignore",
        "excerpt":"참고 : FMOD .gitignore FMOD 프로젝트를 Github에 올리고 관리하기 위해서 추적하는 파일들을 보니 너무 많고 올리지 않아도 되는 파일들이 딸려 들어오는것을 보게 되었다. 바로 gitignore 파일이 있는지 확인 해 보았고 위 참고 사이트에서 사용한 gitignore 파일을 적용하니 필요한 파일만 올라가게 되었다. ### FMOD Unity Integration ### # Never ignore DLLs...","categories": ["Unity"],
        "tags": ["Unity","git","gitignore"],
        "url": "/unity/fmod-gitignore/",
        "teaser": null
      },{
        "title": "Boost.asio async 사용 및 주의점",
        "excerpt":"Boost.Asio async_write Boost.Asio 라이브러리의 async_write를 사용하는 방법은 다음과 같음 boost::asio::async_write(s, boost::asio::buffer(data, size), handler); 각 Parameter는 AsyncWirteStream, ConstBufferSequence, WriteHandler로 되어있음 두 번째 Parameter에는 string과 같이 서버 혹은 클라이언트로 보낼 데이터가 들어가게 되며, 공식 Document에서는 Boost.Asio 라이브러리의 buffer를 사용하도록 권장함 Example void write(std::string message) { auto self(shared_from_this()); boost::asio::async_write(_socket, boost::asio::buffer(message), [self, message](boost::system::error_code ec,...","categories": ["C++"],
        "tags": ["C++","boost.asio","asio","async","dangling-pointer"],
        "url": "/c++/asio-warning/",
        "teaser": null
      },{
        "title": "이동의미론과 std::move",
        "excerpt":"이동 의미론이란 객체의 자원 소유권을 복사를 통해 복제하는 것이 아니라 이전 하는 방식을 성능과 메모리 효율을 극대화 하는 C++11의 중요한 기능임 복사 의미론과 반대로 기존 객체의 내용을 복제하지 않고 기존 객체의 소유권을 새 객체로 이동시켜 불필요한 데이터 복사를 피함 이동 후 원본 객체는 자원을 더 이상 소유하지 않으며, valid-but-unspecified 상태가...","categories": ["C++"],
        "tags": ["c++","cpp","std::move","move","이동의미론"],
        "url": "/c++/move/",
        "teaser": null
      },{
        "title": "lvalue와 rvalue",
        "excerpt":"lvalue 메모리 주소가 존재하며 식별자가 있는 표현식 참조나 대입이 가능, &amp;연산자로 주소를 가져올 수 있음 변수 이름, 배열요소, 반환값이 참조형인 함수 등은 lvalue의 대표적인 예시임 int x = 10; // x -&gt; lvalue int* p = &amp;x; // x의 주소를 받아 올 수 있음 rvalue 메모리 주소가 없거나 사용자가 접근할...","categories": ["C++"],
        "tags": ["lvalue","rvalue","c++","cpp"],
        "url": "/c++/lvalue-rvalue/",
        "teaser": null
      },{
        "title": "스마트 포인터 순환 참조 문제",
        "excerpt":"개인 프로젝트를 진행하면서 안전한 포인터 사용을 위해 스마트 포인터를 사용하였지만 사용 미숙으로 인해 shared_ptr의 상호 참조 문제가 발생하였다 메모리가 해제되지 못하고 끝까지 남아있는 것을 발견하고 해당 문제를 해결하게 되었다 문제점 shared_ptr은 하나의 메모리를 여러 객체가 공유하고자 할 때 사용할 수 있음 당연하게도 A라는 클래스에 대한 shared_ptr을 B라는 클래스의 객체가 소유할...","categories": ["C++"],
        "tags": ["C++","스마트포인터","memory","순환참조"],
        "url": "/c++/smart-pointer/",
        "teaser": null
      },{
        "title": "C++ random_device",
        "excerpt":"기본 사용 #include &lt;random&gt; // ... std::random_device seed; std::mt19937 generator(seed()); auto rNumber = generator(); // ... &lt;random&gt; 헤더를 통해 random_device를 초기화 하고 mt19937(유사 난수 생성기)를 해당 random_device로 초기화 함 mt19937에는 operator()가 정의 되어있으며 호출만 하면 난수가 생성이 됨 random number distribution 정수 균등 분포 생성 #include &lt;random&gt; // ... std::random_device...","categories": ["C++"],
        "tags": ["c++","cpp","random_device","mt19937"],
        "url": "/c++/random-device/",
        "teaser": null
      },{
        "title": "Sample",
        "excerpt":"   Sample Post   #include &lt;iostream&gt;  int main() {     std::cout &lt;&lt; \"hello world!\\n\"; }  ","categories": ["Test"],
        "tags": ["Test","First"],
        "url": "/test/sample/",
        "teaser": null
      },{
        "title": "Tag Dispatching과 Passkey Idiom",
        "excerpt":"Tag Dispatching 정의 C++에서 함수 오버로딩과 템플릿을 활용해 타입이나 속성에 따라 다른 구현을 호출하는 메타프로그래밍 패턴 함수 인자로 태그(빈 구조체나 클래스)를 전달하여 컴파일러가 오버로드 된 함수들 중에서 적합한 구현을 선택하도록 함 예시 #include &lt;iostream&gt; #include &lt;vector&gt; #include &lt;list&gt; #include &lt;iterator&gt; template &lt;typename Iter&gt; void FuncImpl(Iter&amp; it, int n, std::random_access_iterator_tag) {...","categories": ["C++"],
        "tags": ["tag dispatching","passkey idiom","c++","cpp","private tag"],
        "url": "/c++/tag-dispatching-passkey/",
        "teaser": null
      },{
        "title": "보편참조",
        "excerpt":"상황에 따라 lvalue 참조가 되기도 하고, rvalue 참조가 되기도 하는 T&amp;&amp; 형태의 참조 무조건 rvalue 참조인 일반적인 T&amp;&amp; 와 다르게 템플릿 타입 추론이 개입할 때만 성립하는 개념 조건을 만족하는 T&amp;&amp;에 대해 인자에 따라 다음과 같이 동작함 lvalue 전달 시 : T가 U&amp;로 추론되고, 매개변수 타입은 U&amp; &amp;&amp; -&gt; 참조 축약으로...","categories": ["C++"],
        "tags": ["c++","cpp","references","universal references","보편참조"],
        "url": "/c++/universal-reference/",
        "teaser": null
      },{
        "title": "핸들러의 완벽한 전달 std::forward",
        "excerpt":"std::forward std::move는 인자를 무조건 R-Value로 캐스팅하여 이동 생성/연산자를 사용할 수 있도록 하는 함수 std::forward는 보편 참조 (Universal Reference) 매개변수를 받아서 호출자가 넘긴 value category(l-value, r-value)를 보존하여 다시 넘겨주는 함수 L-Value로 들어왔으면 L-Value로, R-Value로 들어왔으면 R-Value로 캐스팅 됨 기본 형태 template &lt;typename T, typename... Args&gt; void wrapper(T&amp;&amp; t, Args&amp;&amp;... args) {...","categories": ["C++"],
        "tags": ["forward","handler","c++","cpp","move"],
        "url": "/c++/std-forward/",
        "teaser": null
      },{
        "title": "Connection Pool",
        "excerpt":"Connection Pool 매 요청마다 새 TCP 연결을 만들지 않고, 미리 만들어 둔 연결들을 빌려쓰고 반납하는 구조 ThreadPool과 같이 생성에 비용이 큰 객체를 미리 만들어 사용하는 것을 목표로 함 구조 클라이언트 측에서 로직 서버로 DB 요청을 하면 로직 서버는 인증 서버와 미리 연결 된 TCP Connection을 Pool에서 받아 해당 Conection으로 로직을...","categories": ["Server"],
        "tags": ["tcp","connection pool","network","server"],
        "url": "/server/connection-pool/",
        "teaser": null
      }]
