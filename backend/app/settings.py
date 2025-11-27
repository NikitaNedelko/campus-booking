"""Файл настроек приложения"""

from pydantic import Field, PostgresDsn
from pydantic_settings import BaseSettings, SettingsConfigDict


class BaseConfig(BaseSettings):
    """Базовый класс для конфигурации приложения"""

    environment: str = Field(alias="ENV", default="tests")

    model_config = SettingsConfigDict(
        env_file_encoding="utf-8",
        env_ignore_empty=True,
        extra="ignore",
    )


class ApplicationConfig(BaseConfig):
    """Конфигурация для приложения"""

    service_name: str = Field(alias="APP_SERVICE_NAME", default="campus-booking")
    port: int = Field(alias="APP_PORT", default=8000)
    host: str = Field(alias="APP_HOST", default="0.0.0.0")
    path_prefix: str = Field(alias="PATH_PREFIX", default="/api")


class DatabaseConfig(BaseConfig):
    """Конфигурация для базы данных"""

    user: str = Field(alias="DATABASE_USERNAME", default="test_user")
    name: str = Field(alias="DATABASE_NAME", default="test_db")
    password: str = Field(alias="DATABASE_PASSWORD", default="test_password")
    port: int = Field(alias="DATABASE_PORT", default=5432)
    host: str = Field(alias="DATABASE_HOST", default="localhost")
    ssl_cert_path: str = Field(alias="DATABASE_SSL_CERT", default="")

    @property
    def dsn(self) -> str:
        """Возвращает строку подключения к базе данных в формате DSN"""
        return str(
            PostgresDsn.build(
                scheme="postgresql+asyncpg",
                username=self.user,
                password=self.password,
                host=self.host,
                port=self.port,
                path=f"{self.name}",
            )
        )


class RedisConfig(BaseConfig):
    """Конфигурация для Redis"""

    host: str = Field(alias="REDIS_HOST", default="localhost")
    port: int = Field(alias="REDIS_PORT", default=6379)
    user: str = Field(alias="REDIS_USER", default="user")
    user_password: str = Field(alias="REDIS_USER_PASSWORD", default="userpass")
    db: int = Field(alias="REDIS_DB", default=0)
    ssl: bool = Field(alias="REDIS_SSL", default=False)
    cert_path: str = Field(alias="REDIS_CERT_PATH", default=".cloud/cert.pem")

    @property
    def url(self) -> str:
        """Возвращает URL для подключения к Redis"""
        return f"redis{'s' if self.ssl else ''}://{self.user}:{self.user_password}@{self.host}:{self.port}/{self.db}"


class Config:
    app = ApplicationConfig()
    database = DatabaseConfig()
    redis = RedisConfig()


settings = Config()
