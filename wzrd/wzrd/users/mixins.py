class IsAuthorisedMixin:
    def __init__(self, *args, **kwargs):
        self.auth_token = None
        super().__init__(*args, **kwargs)
