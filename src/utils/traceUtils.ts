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
};

export default TraceUtils;
