const TraceUtils = {
  raycastFirst(
    app: pc.Application,
    start: pc.Vec3,
    end: pc.Vec3,
    debug: boolean = false
  ): pc.RaycastResult | undefined {
    if (debug) {
      console.info("Raycast from", start, "to", end);
    }
    return app.systems.rigidbody?.raycastFirst(start, end);
  },
  // TODO: sweep tests, raycastAll, etc.
  // SweepCapsuleSingleByChannel
  // SweepSphereSingleByChannel
  // OverlapCapsuleAnyByProfile
  // OverlapBlockingTestByProfile
};

export default TraceUtils;
