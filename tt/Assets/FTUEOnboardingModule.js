// ==============================================================================
// INFINITY // FTUEOnboardingModule.js (Lens Studio Native Port)
// First-Time Interactive Tutorial with Exact Ergonomic Steps:
// 1. "PINCH ANY NOTE TO REPOSITION"
// 2. "PINCH A PLANET TO EXPLORE ANOTHER WORLD"
// 3. "LOOK AWAY TO GIVE YOUR WORLD ROOM TO BREATHE"
// Disappears after completion, preserves persistence, supports replay.
// ==============================================================================

function FTUEOnboarding(storageKey) {
    this.storageKey = storageKey || "INFINITY_FTUE_V3";
    this.completed = false;
    
    // Check persistent storage
    if (global.persistentStorageSystem && global.persistentStorageSystem.store) {
        try {
            this.completed = (global.persistentStorageSystem.store.getString(this.storageKey) === "true");
        } catch(e) {}
    }
    
    this.active = !this.completed;
    this.step = this.active ? 1 : 0;

    this.steps = [
        {
            id: 1,
            tag: "STEP 1 OF 3 // SPATIAL SELECTION",
            prompt: "PINCH ANY NOTE TO REPOSITION",
            detail: "Grab a 3D thought card with pinch & drag across your physical desk."
        },
        {
            id: 2,
            tag: "STEP 2 OF 3 // CELESTIAL NAV",
            prompt: "PINCH A PLANET TO EXPLORE ANOTHER WORLD",
            detail: "Pinch any orbiting planetary sphere below to warp to that workspace."
        },
        {
            id: 3,
            tag: "STEP 3 OF 3 // AMBIENT ERGONOMICS",
            prompt: "LOOK AWAY TO GIVE YOUR WORLD ROOM TO BREATHE",
            detail: "Tilt your head up or glance away to watch INFINITY softly fade to ambient transparency."
        }
    ];

    this.listeners = [];
}

FTUEOnboarding.prototype.onStepChange = function(cb) {
    if (typeof cb === "function") this.listeners.push(cb);
};

FTUEOnboarding.prototype.notify = function() {
    for (var i = 0; i < this.listeners.length; i++) {
        try { this.listeners[i](this.step, this.getCurrentStepData()); } catch(e) {}
    }
};

FTUEOnboarding.prototype.isActive = function() {
    return this.active && !this.completed && this.step >= 1 && this.step <= 3;
};

FTUEOnboarding.prototype.getCurrentStepData = function() {
    if (!this.isActive()) return null;
    return this.steps[this.step - 1];
};

FTUEOnboarding.prototype.advance = function(expectedStep) {
    if (!this.active) return;
    if (!expectedStep || this.step === expectedStep) {
        if (this.step < 3) {
            this.step += 1;
            this.notify();
        } else {
            this.finish();
        }
    }
};

FTUEOnboarding.prototype.finish = function() {
    this.active = false;
    this.completed = true;
    this.step = 0;
    if (global.persistentStorageSystem && global.persistentStorageSystem.store) {
        try {
            global.persistentStorageSystem.store.putString(this.storageKey, "true");
        } catch(e) {}
    }
    this.notify();
    print("[INFINITY ONBOARDING] ✓ Tutorial completed and persisted.");
};

FTUEOnboarding.prototype.reset = function() {
    this.completed = false;
    this.active = true;
    this.step = 1;
    if (global.persistentStorageSystem && global.persistentStorageSystem.store) {
        try {
            global.persistentStorageSystem.store.putString(this.storageKey, "false");
        } catch(e) {}
    }
    this.notify();
    print("[INFINITY ONBOARDING] ↺ Tutorial reset for replay.");
};

global.FTUEOnboarding = FTUEOnboarding;
