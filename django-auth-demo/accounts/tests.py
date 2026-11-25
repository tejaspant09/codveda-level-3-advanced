from django.contrib.auth import get_user_model
from django.core import mail
from django.test import Client, TestCase, override_settings
from urllib.parse import urlsplit


@override_settings(PASSWORD_HASHERS=["django.contrib.auth.hashers.MD5PasswordHasher"])
class AuthenticationFlowTests(TestCase):
    def setUp(self):
        self.password = "Maple-River-38!"
        self.user = get_user_model().objects.create_user(
            username="tejas-demo",
            email="tejas@example.test",
            password=self.password,
        )

    def test_auth_pages_render_with_absolute_static_stylesheet(self):
        for path in (
            "/",
            "/signup/",
            "/accounts/login/",
            "/accounts/password-reset/",
            "/accounts/password-reset/done/",
        ):
            with self.subTest(path=path):
                response = self.client.get(path)
                self.assertEqual(response.status_code, 200)
                self.assertContains(response, 'href="/static/accounts/auth.css"')

    def test_dashboard_redirects_anonymous_visitors_to_sign_in(self):
        response = self.client.get("/dashboard/")
        self.assertRedirects(response, "/accounts/login/?next=/dashboard/")

    def test_signup_hashes_password_and_starts_a_session(self):
        response = self.client.post(
            "/signup/",
            {
                "username": "new-learner",
                "email": "learner@example.test",
                "password1": "Juniper-Sky-482!",
                "password2": "Juniper-Sky-482!",
            },
        )
        self.assertRedirects(response, "/dashboard/")
        new_user = get_user_model().objects.get(username="new-learner")
        self.assertTrue(new_user.check_password("Juniper-Sky-482!"))
        self.assertNotEqual(new_user.password, "Juniper-Sky-482!")
        self.assertIn("_auth_user_id", self.client.session)

    def test_signup_rejects_mismatched_passwords(self):
        response = self.client.post(
            "/signup/",
            {
                "username": "bad-learner",
                "email": "bad@example.test",
                "password1": "Juniper-Sky-482!",
                "password2": "different-password",
            },
        )
        self.assertEqual(response.status_code, 200)
        self.assertFalse(
            get_user_model().objects.filter(username="bad-learner").exists()
        )
        self.assertContains(response, "The two password fields didn’t match.")

    def test_login_and_post_only_logout(self):
        response = self.client.post(
            "/accounts/login/",
            {"username": self.user.username, "password": self.password},
        )
        self.assertRedirects(response, "/dashboard/")
        self.assertEqual(self.client.get("/dashboard/").status_code, 200)
        self.assertEqual(self.client.get("/accounts/logout/").status_code, 405)
        response = self.client.post("/accounts/logout/")
        self.assertRedirects(response, "/")
        self.assertNotIn("_auth_user_id", self.client.session)

    def test_bad_credentials_are_rejected(self):
        response = self.client.post(
            "/accounts/login/",
            {"username": self.user.username, "password": "wrong-password"},
        )
        self.assertEqual(response.status_code, 200)
        self.assertNotIn("_auth_user_id", self.client.session)
        self.assertContains(response, "Please enter a correct username and password")

    @override_settings(EMAIL_BACKEND="django.core.mail.backends.locmem.EmailBackend")
    def test_password_reset_link_changes_the_password(self):
        response = self.client.post(
            "/accounts/password-reset/", {"email": self.user.email}
        )
        self.assertRedirects(response, "/accounts/password-reset/done/")
        self.assertEqual(len(mail.outbox), 1)
        reset_url = next(
            line for line in mail.outbox[0].body.splitlines()
            if "/accounts/reset/" in line
        )
        reset_path = urlsplit(reset_url).path
        response = self.client.get(reset_path, follow=True)
        self.assertEqual(response.status_code, 200)
        confirm_path = response.redirect_chain[-1][0]
        response = self.client.post(
            confirm_path,
            {
                "new_password1": "Juniper-Sky-482!",
                "new_password2": "Juniper-Sky-482!",
            },
        )
        self.assertRedirects(response, "/accounts/reset/complete/")
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password("Juniper-Sky-482!"))

    def test_csrf_is_required_for_signup_and_logout(self):
        strict = Client(enforce_csrf_checks=True)
        signup_response = strict.post(
            "/signup/",
            {
                "username": "csrf-learner",
                "email": "csrf@example.test",
                "password1": "Juniper-Sky-482!",
                "password2": "Juniper-Sky-482!",
            },
        )
        self.assertEqual(signup_response.status_code, 403)
        strict.force_login(self.user)
        self.assertEqual(strict.post("/accounts/logout/").status_code, 403)
