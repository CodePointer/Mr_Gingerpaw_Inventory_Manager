from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models import Item, Transaction, Membership

from app.schemas.item_transfer import ItemTransferRequest

def transfer_items(db: Session, transfer: ItemTransferRequest):
    user_id = transfer.user_id
    from_family = transfer.from_family_id
    to_family = transfer.to_family_id

    # Check if user belongs to both families
    for fam_id in [from_family, to_family]:
        member = db.query(Membership).filter_by(user_id=user_id, family_id=fam_id).first()
        if not member:
            raise HTTPException(status_code=403, detail=f"User {user_id} is not a member of family {fam_id}")

    for entry in transfer.items:
        item = db.query(Item).filter_by(id=entry.item_id, family_id=from_family).first()
        if not item:
            raise HTTPException(status_code=404, detail=f"Item {entry.item_id} not found in source family")

        if item.quantity < entry.quantity:
            raise HTTPException(status_code=400, detail=f"Not enough quantity in item {item.name}")

        # Remove from original family
        item.quantity -= entry.quantity

        # Try to find the same item
        dest_item = db.query(Item).filter_by(
            name=item.name,
            unit=item.unit,
            location=entry.location,
            category=item.category,
            family_id=to_family
        ).first()

        if dest_item:
            dest_item.quantity += entry.quantity
        else:
            # Add new item
            dest_item = Item(
                name=item.name,
                unit=item.unit,
                quantity=entry.quantity,
                location=entry.location,
                family_id=to_family,
                owner_id=user_id,
                category=item.category,
                notes=item.notes,
                raw_input=item.raw_input
            )
            db.add(dest_item)
            db.flush()

        # transaction（REMOVE）
        db.add(Transaction(
            item_id=item.id,
            user_id=user_id,
            family_id=from_family,
            change_type="REMOVE",
            quantity=entry.quantity,
            unit=item.unit,
            location=item.location,
            notes=f"Transferred to family {to_family}: {transfer.notes}",
            status="CONFIRMED"
        ))

        # transaction（ADD）
        db.add(Transaction(
            item_id=dest_item.id,
            user_id=user_id,
            family_id=to_family,
            change_type="ADD",
            quantity=entry.quantity,
            unit=item.unit,
            location=entry.location,
            notes=f"Transferred from family {from_family}: {transfer.notes}",
        ))

        db.commit()
        return {"msg": "Transfer completed"}
