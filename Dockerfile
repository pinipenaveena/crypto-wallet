
FROM eclipse-temurin:25-jdk

WORKDIR /app

COPY . .

RUN chmod +x mvnw
RUN ./mvnw -B clean package -DskipTests

CMD ["sh", "-c", "java -Dserver.port=${PORT:-10000} -jar target/*.jar"]
