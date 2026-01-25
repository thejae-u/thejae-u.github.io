# Apple Silicon (arm64)와 Intel(amd64) 모두에서 동작하게 multi-arch 지원 이미지 사용
FROM ruby:3.2

# 필수 패키지 (node, npm, build-essential 등) 설치
RUN apt-get update && \
    apt-get install -y build-essential nodejs npm && \
    rm -rf /var/lib/apt/lists/*

# 작업 디렉터리
WORKDIR /usr/src/app

# Gemfile, Gemfile.lock만 먼저 복사해서 bundle 캐시 활용
COPY Gemfile Gemfile.lock* ./

# Jekyll/Minimal Mistakes 의존성 설치
RUN bundle install

# 나머지 사이트 소스 복사
COPY . .

# 컨테이너 포트
EXPOSE 4000

# 로컬 개발용 기본 커맨드
CMD ["bundle", "exec", "jekyll", "serve", "--host", "0.0.0.0", "--watch", "--force_polling"]

