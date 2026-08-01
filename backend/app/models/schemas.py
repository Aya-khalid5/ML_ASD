"""Pydantic schemas for the prediction API."""

from typing import Literal

from pydantic import BaseModel, Field


class ScreeningInput(BaseModel):
    """Raw screening answers submitted by the user.

    These mirror the exact columns the model was trained on. Binary fields
    use 0/1 and categorical fields accept one of the values the encoder saw
    during training (validated later against the model metadata).
    """

    # AQ-10 item scores
    A1_Score: int = Field(ge=0, le=1)
    A2_Score: int = Field(ge=0, le=1)
    A3_Score: int = Field(ge=0, le=1)
    A4_Score: int = Field(ge=0, le=1)
    A5_Score: int = Field(ge=0, le=1)
    A6_Score: int = Field(ge=0, le=1)
    A7_Score: int = Field(ge=0, le=1)
    A8_Score: int = Field(ge=0, le=1)
    A9_Score: int = Field(ge=0, le=1)
    A10_Score: int = Field(ge=0, le=1)

    # Demographics
    age: int = Field(ge=1, le=100, description="Age of the person being screened")
    gender: Literal[0, 1] = Field(description="0 = male, 1 = female")
    ethnicity: str = Field(description="Ethnicity of the person being screened")
    contry_of_res: str = Field(description="Country of residence")

    # Clinical background
    jundice: Literal[0, 1] = Field(description="Born with jaundice (0/1)")
    austim: Literal[0, 1] = Field(description="Family member diagnosed with ASD (0/1)")
    used_app_before: Literal[0, 1] = Field(
        description="Whether the app was used before for a screening (0/1)"
    )

    # Who is completing the screening
    relation: str = Field(description="Relation of the person completing the form")


class ProbabilityBreakdown(BaseModel):
    """Probability of each outcome class."""

    asd: float
    no_asd: float


class PredictionResponse(BaseModel):
    """Standardized response for a single prediction."""

    prediction: int = Field(description="1 = ASD traits, 0 = no ASD traits")
    prediction_label: str = Field(description="Human-readable label")
    probability: ProbabilityBreakdown
    confidence: float = Field(
        description="Confidence of the winning class, between 0 and 1"
    )
    message: str = Field(description="User-friendly explanation of the result")

