# Firestore Rule Suggestions For Deliveries And Public Tracking

These are suggested additions for the FlowLo tracking and delivery portal.

They are not applied automatically so the current rules file stays untouched.

## Suggested deliveries rules

```txt
match /deliveries/{deliveryId} {
  allow read, list: if ownsApproved(resource.data);
  allow create: if isApprovedUser(request.auth.uid)
    && request.resource.data.ownerId == request.auth.uid;
  allow update: if ownsApproved(resource.data)
    && request.resource.data.ownerId == request.auth.uid;
  allow delete: if false;
}
```

## Suggested public tracking rule

If you want `/track/[trackingId]` to read directly from Firestore on the client, you need a public-safe rule for only the minimum tracking fields.

Safer production option:
- Move public tracking data into a separate collection such as `publicTracking`.
- Only store public-safe fields there.
- Keep private delivery details inside `deliveries`.

Direct MVP option:

```txt
match /deliveries/{deliveryId} {
  allow get: if ownsApproved(resource.data)
    || (
      resource.data.trackingId == deliveryId
      && resource.data.keys().hasOnly([
        'orderId',
        'orderNumber',
        'trackingId',
        'customerName',
        'customerPhone',
        'deliveryAddress',
        'deliveryNotes',
        'assignedCourier',
        'estimatedDeliveryTime',
        'deliveryStatus',
        'supportPhone',
        'ownerId',
        'businessId',
        'createdAt',
        'updatedAt'
      ])
    );
}
```

## Recommended next step

For production, prefer a dedicated `publicTracking/{trackingId}` document with only:

- `trackingId`
- `orderNumber`
- `customerName`
- `deliveryStatus`
- `estimatedDeliveryTime`
- `supportPhone`
- `createdAt`
- `updatedAt`

