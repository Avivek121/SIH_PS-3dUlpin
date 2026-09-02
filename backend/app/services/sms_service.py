"""SMS Service Abstraction Layer.

Supports: Demo (mock), Twilio, MSG91, Firebase.
In demo mode, OTP is always 123456 and logged to console.
"""
import logging
import secrets
from abc import ABC, abstractmethod
from app.config import settings

logger = logging.getLogger(__name__)

DEMO_OTP = "123456"


class BaseSMSProvider(ABC):
    @abstractmethod
    async def send_otp(self, phone: str, otp: str) -> bool:
        """Send OTP via SMS. Returns True on success."""
        ...


class DemoSMSProvider(BaseSMSProvider):
    """Mock SMS provider for development/demo mode.
    Always succeeds and logs OTP to console.
    """
    async def send_otp(self, phone: str, otp: str) -> bool:
        logger.info(f"[DEMO SMS] OTP for {phone}: {otp}")
        print(f"\n{'='*50}")
        print(f"  [DEMO MODE] OTP for {phone}: {otp}")
        print(f"  Use OTP: {DEMO_OTP} (demo mode accepts this)")
        print(f"{'='*50}\n")
        return True


class TwilioSMSProvider(BaseSMSProvider):
    """Twilio SMS provider. Requires TWILIO_* env vars."""
    def __init__(self):
        self.account_sid = settings.TWILIO_ACCOUNT_SID
        self.auth_token = settings.TWILIO_AUTH_TOKEN
        self.from_number = settings.TWILIO_PHONE_NUMBER

    async def send_otp(self, phone: str, otp: str) -> bool:
        try:
            import asyncio
            from twilio.rest import Client
            client = Client(self.account_sid, self.auth_token)
            loop = asyncio.get_running_loop()
            await loop.run_in_executor(
                None,
                lambda: client.messages.create(
                    body=f"Your 3D ULPIN verification code is: {otp}",
                    from_=self.from_number,
                    to=phone
                )
            )
            return True
        except Exception as e:
            logger.error(f"Twilio SMS failed: {e}")
            return False


class MSG91SMSProvider(BaseSMSProvider):
    """MSG91 SMS provider. Ready for integration."""
    async def send_otp(self, phone: str, otp: str) -> bool:
        logger.warning("MSG91 provider not yet configured")
        return False


def get_sms_provider() -> BaseSMSProvider:
    """Factory: returns the configured SMS provider."""
    if settings.SMS_PROVIDER == "twilio" and settings.TWILIO_ACCOUNT_SID:
        return TwilioSMSProvider()
    # Default to demo
    return DemoSMSProvider()


def generate_otp() -> str:
    """Generate a 6-digit OTP."""
    if settings.DEMO_MODE:
        return DEMO_OTP
    return "".join([str(secrets.randbelow(10)) for _ in range(6)])


def verify_demo_otp(otp: str) -> bool:
    """In demo mode, accept the demo OTP."""
    return otp == DEMO_OTP
