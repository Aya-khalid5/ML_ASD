"""Custom exceptions for the prediction service."""


class InvalidFeatureValueError(ValueError):
    """Raised when a categorical value was never seen during training."""

    def __init__(self, column: str, value):
        self.column = column
        self.value = value
        super().__init__(
            f"'{value}' is not a valid value for '{column}'. "
            f"Please choose from the options provided."
        )

