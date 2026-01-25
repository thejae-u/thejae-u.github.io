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
        "title": "스마트 포인터 순환 참조 문제",
        "excerpt":"오류 사항은 contact@thejaeu.com 으로 보내주시기 바랍니다 개인 프로젝트를 진행하면서 안전한 포인터 사용을 위해 스마트 포인터를 사용하였지만 사용 미숙으로 인해 shared_ptr의 상호 참조 문제가 발생하였다 메모리가 해제되지 못하고 끝까지 남아있는 것을 발견하고 해당 문제를 해결하게 되었다 문제점 shared_ptr은 하나의 메모리를 여러 객체가 공유하고자 할 때 사용할 수 있음 당연하게도 A라는 클래스에...","categories": ["C++"],
        "tags": ["C++","스마트포인터","memory","순환참조"],
        "url": "/c++/smart-pointer/",
        "teaser": null
      },{
        "title": "C++ random_device",
        "excerpt":"오류 사항은 contact@thejaeu.com 으로 보내주시기 바랍니다 기본 사용 #include &lt;random&gt; // ... std::random_device seed; std::mt19937 generator(seed()); auto rNumber = generator(); // ... &lt;random&gt; 헤더를 통해 random_device를 초기화 하고 mt19937(유사 난수 생성기)를 해당 random_device로 초기화 함 mt19937에는 operator()가 정의 되어있으며 호출만 하면 난수가 생성이 됨 random number distribution 정수 균등 분포...","categories": ["C++"],
        "tags": ["c++","cpp","random_device","mt19937"],
        "url": "/c++/random-device/",
        "teaser": null
      },{
        "title": "Sample",
        "excerpt":"   Sample Post   #include &lt;iostream&gt;  int main() {     std::cout &lt;&lt; \"hello world!\\n\"; }  ","categories": ["Test"],
        "tags": ["Test","First"],
        "url": "/test/sample/",
        "teaser": null
      }]
