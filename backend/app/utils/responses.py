"""Human-friendly messages returned alongside every prediction."""


def build_result_message(prediction: int, confidence: float) -> str:
    """Craft a clear, professional explanation for the user.

    The tone is informative and reassuring: this tool is a screening aid,
    not a diagnostic device, and that message stays consistent no matter
    what the model outputs.
    """

    if prediction == 1:
        if confidence >= 0.9:
            return (
                "The screening results show a strong likelihood of ASD traits. "
                "Please remember this is an initial screening indication, not a "
                "medical diagnosis. We recommend speaking with a qualified "
                "healthcare professional for a complete assessment."
            )
        if confidence >= 0.7:
            return (
                "The screening results suggest that ASD traits may be present. "
                "A healthcare professional should review these results and, if "
                "appropriate, arrange a more detailed diagnostic evaluation."
            )
        return (
            "The screening results lean toward the presence of ASD traits, "
            "but with moderate confidence. Discussing these results with a "
            "qualified professional would be a sensible next step."
        )

    if confidence >= 0.9:
        return (
            "The screening results show no strong indication of ASD traits. "
            "Keep in mind that this tool is a screening aid and is not a "
            "substitute for a professional clinical assessment."
        )
    if confidence >= 0.7:
        return (
            "The screening results do not clearly indicate ASD traits. If you "
            "still have concerns, talking to a healthcare professional can "
            "provide more clarity."
        )
    return (
        "The screening results lean toward no ASD traits, but the confidence "
        "is borderline. A professional evaluation can give you greater peace "
        "of mind if you have any doubts."
    )

