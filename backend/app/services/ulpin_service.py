"""ULPIN generation and parsing service.

ULPIN Format: {STATE}-{CITY}-{WARD}-{PARCEL}-{BUILDING}-{FLOOR}-{UNIT}
Example: OD-BBSR-W12-P001-B03-F04-U02
"""
from dataclasses import dataclass
from typing import Optional


@dataclass
class ULPINComponents:
    state_code: str
    city_code: str
    ward_code: str
    parcel_id: str
    building_id: Optional[str] = None
    floor_id: Optional[str] = None
    unit_id: Optional[str] = None

    @property
    def full_ulpin(self) -> str:
        parts = [self.state_code, self.city_code, self.ward_code, self.parcel_id]
        if self.building_id:
            parts.append(self.building_id)
        if self.floor_id:
            parts.append(self.floor_id)
        if self.unit_id:
            parts.append(self.unit_id)
        return "-".join(parts)

    @property
    def parcel_ulpin(self) -> str:
        return f"{self.state_code}-{self.city_code}-{self.ward_code}-{self.parcel_id}"

    @property
    def building_ulpin(self) -> str:
        if self.building_id:
            return f"{self.parcel_ulpin}-{self.building_id}"
        return self.parcel_ulpin

    @property
    def floor_ulpin(self) -> str:
        if self.floor_id:
            return f"{self.building_ulpin}-{self.floor_id}"
        return self.building_ulpin

    def to_dict(self) -> dict:
        return {
            "state_code": self.state_code,
            "city_code": self.city_code,
            "ward_code": self.ward_code,
            "parcel_id": self.parcel_id,
            "building_id": self.building_id,
            "floor_id": self.floor_id,
            "unit_id": self.unit_id,
            "full_ulpin": self.full_ulpin,
        }


def parse_ulpin(ulpin_code: str) -> Optional[ULPINComponents]:
    """Parse a ULPIN code into its components.
    
    Supports partial ULPINs:
    - OD-BBSR-W12-P001 (parcel level)
    - OD-BBSR-W12-P001-B03 (building level)
    - OD-BBSR-W12-P001-B03-F04 (floor level)
    - OD-BBSR-W12-P001-B03-F04-U02 (unit level)
    """
    parts = ulpin_code.strip().upper().split("-")
    if len(parts) < 4:
        return None

    components = ULPINComponents(
        state_code=parts[0],
        city_code=parts[1],
        ward_code=parts[2],
        parcel_id=parts[3],
    )

    if len(parts) >= 5:
        components.building_id = parts[4]
    if len(parts) >= 6:
        components.floor_id = parts[5]
    if len(parts) >= 7:
        components.unit_id = parts[6]

    return components


def _clean_token(prefix: str, val, digits: int = 2) -> str:
    if val is None:
        return ""
    val_str = str(val).strip().upper()
    if val_str.startswith(prefix):
        val_str = val_str[len(prefix):]
    try:
        num = int("".join(c for c in val_str if c.isdigit()))
        return f"{prefix}{num:0{digits}d}"
    except (ValueError, TypeError):
        return f"{prefix}{val_str}"

def generate_ulpin(
    state_code: str,
    city_code: str,
    ward_code: str,
    parcel_number,
    building_number = None,
    floor_number = None,
    unit_number = None,
) -> str:
    parts = [
        state_code.upper(),
        city_code.upper(),
        ward_code.upper(),
        _clean_token("P", parcel_number, 3),
    ]

    if building_number is not None:
        parts.append(_clean_token("B", building_number, 2))
        if floor_number is not None:
            parts.append(_clean_token("F", floor_number, 2))
            if unit_number is not None:
                parts.append(_clean_token("U", unit_number, 2))

    return "-".join(parts)


def extract_search_terms(query: str) -> dict:
    """Extract searchable terms from a user query.
    
    Handles various search inputs:
    - Full ULPIN: OD-BBSR-W12-P001-B03-F04-U02
    - Partial ULPIN: B03-F04-U02
    - Parcel ID: P001
    - Building ID: B03
    - Unit number: 402
    - Owner name: "Demo Owner"
    - Coordinates: 20.2961, 85.8245
    """
    query = query.strip()
    result = {
        "query": query,
        "type": "text",
        "ulpin_components": None,
        "parcel_id": None,
        "building_id": None,
        "floor_number": None,
        "unit_number": None,
    }

    # Try full ULPIN parse
    components = parse_ulpin(query)
    if components:
        result["type"] = "ulpin"
        result["ulpin_components"] = components.to_dict()
        return result

    # Check for partial building-floor-unit pattern (e.g., B03-F04-U02)
    parts = query.upper().split("-")
    for part in parts:
        if part.startswith("P") and part[1:].isdigit():
            result["parcel_id"] = part
            result["type"] = "parcel"
        elif part.startswith("B") and part[1:].isdigit():
            result["building_id"] = part
            result["type"] = "building"
        elif part.startswith("F") and part[1:].isdigit():
            result["floor_number"] = int(part[1:])
        elif part.startswith("U") and part[1:].isdigit():
            result["unit_number"] = int(part[1:])

    # Check for unit number (e.g., 402)
    if query.isdigit() and len(query) == 3:
        result["type"] = "unit_number"
        result["floor_number"] = int(query[0])
        result["unit_number"] = int(query)

    # Check for coordinates (e.g., 20.2961, 85.8245)
    if "," in query:
        try:
            lat_str, lon_str = query.split(",")
            lat, lon = float(lat_str.strip()), float(lon_str.strip())
            if -90 <= lat <= 90 and -180 <= lon <= 180:
                result["type"] = "coordinates"
                result["latitude"] = lat
                result["longitude"] = lon
        except (ValueError, IndexError):
            pass

    return result
