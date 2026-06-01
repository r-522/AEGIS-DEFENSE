"use client";

import { useRef, useEffect, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Stars, Environment } from "@react-three/drei";
import * as THREE from "three";
import { gameEngine } from "@/engine/GameEngine";
import { useGameStore } from "@/lib/store/gameStore";
import type { EnemySnapshot, TowerSnapshot, ProjectileSnapshot } from "@/engine/GameEngine";

// ── Battle Map ──────────────────────────────────────────────────

function BattleMap() {
  return (
    <group>
      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
        <planeGeometry args={[28, 30]} />
        <meshStandardMaterial
          color="#131820"
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>

      {/* Lane markers */}
      {[-6, 0, 6].map((x) => (
        <mesh key={x} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0, 0]} receiveShadow>
          <planeGeometry args={[1.8, 28]} />
          <meshStandardMaterial color="#1a2030" roughness={0.95} />
        </mesh>
      ))}

      {/* Lane lines */}
      {[-6, 0, 6].map((x) => (
        <group key={`line-${x}`}>
          <mesh position={[x - 0.9, 0.01, 0]}>
            <boxGeometry args={[0.02, 0.01, 28]} />
            <meshStandardMaterial color="#2B323D" emissive="#2B323D" emissiveIntensity={0.3} />
          </mesh>
          <mesh position={[x + 0.9, 0.01, 0]}>
            <boxGeometry args={[0.02, 0.01, 28]} />
            <meshStandardMaterial color="#2B323D" emissive="#2B323D" emissiveIntensity={0.3} />
          </mesh>
        </group>
      ))}

      {/* Base structure */}
      <group position={[0, 0, -12]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[20, 0.5, 3]} />
          <meshStandardMaterial color="#1a2535" roughness={0.7} metalness={0.3} />
        </mesh>
        {/* Gate pillars */}
        {[-8, -4, 0, 4, 8].map((x) => (
          <mesh key={x} position={[x, 2, 0]} castShadow>
            <boxGeometry args={[1, 4, 1]} />
            <meshStandardMaterial color="#2B323D" roughness={0.6} metalness={0.4} />
          </mesh>
        ))}
        {/* Base glow line */}
        <mesh position={[0, 0.3, 0]}>
          <boxGeometry args={[20, 0.05, 0.1]} />
          <meshStandardMaterial color="#5FD7D1" emissive="#5FD7D1" emissiveIntensity={2} />
        </mesh>
      </group>

      {/* Spawn portals */}
      {[-6, 0, 6].map((x) => (
        <group key={`portal-${x}`} position={[x, 0, 12]}>
          <mesh>
            <cylinderGeometry args={[1.5, 1.5, 0.1, 16]} />
            <meshStandardMaterial
              color="#D45A35"
              emissive="#D45A35"
              emissiveIntensity={0.5}
              transparent
              opacity={0.6}
            />
          </mesh>
          <SpawnPortalRing x={x} />
        </group>
      ))}

      {/* Tower placement grid (faint) */}
      {Array.from({ length: 6 }, (_, col) =>
        Array.from({ length: 8 }, (_, row) => {
          const x = (col - 2.5) * 3;
          const z = row * 2.5 - 9;
          const isLaneBlocked = Math.abs(x) < 1.2;
          if (isLaneBlocked) return null;
          return (
            <mesh key={`${col}-${row}`} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.02, z]}>
              <planeGeometry args={[1.6, 1.6]} />
              <meshStandardMaterial
                color="#2B323D"
                transparent
                opacity={0.15}
              />
            </mesh>
          );
        })
      )}
    </group>
  );
}

function SpawnPortalRing({ x }: { x: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((_, dt) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += dt * 1.5;
    }
  });
  return (
    <mesh ref={meshRef} position={[0, 0.5, 0]}>
      <torusGeometry args={[1.5, 0.08, 6, 24]} />
      <meshStandardMaterial color="#D45A35" emissive="#D45A35" emissiveIntensity={1.5} />
    </mesh>
  );
}

// ── Player ──────────────────────────────────────────────────────

function PlayerMesh({ position, rotation }: { position: THREE.Vector3; rotation: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const attackRef = useRef<THREE.Mesh>(null);
  const { snapshot } = useGameStore();

  useFrame((_, dt) => {
    if (!groupRef.current) return;
    groupRef.current.position.lerp(position, dt * 15);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      rotation,
      dt * 12
    );
  });

  const hpPct = snapshot ? snapshot.playerHp / snapshot.playerMaxHp : 1;
  const bodyColor = hpPct > 0.5 ? "#C8A45D" : hpPct > 0.25 ? "#D49A35" : "#D45A35";

  return (
    <group ref={groupRef} position={[0, 0.5, -2]}>
      {/* Body */}
      <mesh castShadow position={[0, 0.6, 0]}>
        <capsuleGeometry args={[0.35, 1.0, 6, 12]} />
        <meshStandardMaterial color={bodyColor} roughness={0.3} metalness={0.7} />
      </mesh>
      {/* Head */}
      <mesh castShadow position={[0, 1.5, 0]}>
        <sphereGeometry args={[0.25, 8, 8]} />
        <meshStandardMaterial color="#D8D0BE" roughness={0.4} metalness={0.5} />
      </mesh>
      {/* Weapon */}
      <mesh castShadow position={[0.45, 0.8, 0]} rotation={[0, 0, -0.4]}>
        <boxGeometry args={[0.1, 1.2, 0.08]} />
        <meshStandardMaterial color="#8B9098" roughness={0.2} metalness={0.9} />
      </mesh>
      {/* Gold accent ring */}
      <mesh position={[0, 0.2, 0]}>
        <torusGeometry args={[0.4, 0.03, 6, 16]} />
        <meshStandardMaterial color="#C8A45D" emissive="#C8A45D" emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}

// ── Enemies ─────────────────────────────────────────────────────

const ENEMY_COLORS: Record<string, string> = {
  swarm: "#8B9098",
  bruiser: "#2B323D",
  runner: "#9B59B6",
  flyer: "#5FD7D1",
  saboteur: "#C8A45D",
  shielder: "#6FA38B",
  artillery: "#D45A35",
  boss: "#D45A35",
};

function EnemyMesh({ enemy }: { enemy: EnemySnapshot }) {
  const meshRef = useRef<THREE.Group>(null);
  const def = require("@/data/enemies").ENEMY_DEFS[enemy.defId];
  const role = def?.role || "swarm";
  const color = def?.color || ENEMY_COLORS[role] || "#8B9098";
  const scale = def?.scale || 1;
  const isBoss = role === "boss";

  useFrame((_, dt) => {
    if (!meshRef.current) return;
    const target = new THREE.Vector3(enemy.position.x, enemy.position.y, enemy.position.z);
    meshRef.current.position.lerp(target, dt * 8);
  });

  const hpPct = enemy.hp / enemy.maxHp;
  const barWidth = 0.8 * scale;

  return (
    <group ref={meshRef} position={[enemy.position.x, enemy.position.y, enemy.position.z]}>
      {/* Body shape based on role */}
      {isBoss ? (
        <mesh castShadow>
          <boxGeometry args={[scale * 1.2, scale * 1.2, scale * 1.2]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} roughness={0.3} metalness={0.5} />
        </mesh>
      ) : role === "flyer" ? (
        <mesh castShadow rotation={[0, 0, Math.PI / 4]}>
          <octahedronGeometry args={[scale * 0.5]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.2} roughness={0.4} />
        </mesh>
      ) : role === "bruiser" ? (
        <mesh castShadow>
          <boxGeometry args={[scale * 0.8, scale * 0.9, scale * 0.8]} />
          <meshStandardMaterial color={color} roughness={0.5} metalness={0.6} />
        </mesh>
      ) : (
        <mesh castShadow>
          <capsuleGeometry args={[scale * 0.3, scale * 0.5, 4, 8]} />
          <meshStandardMaterial color={color} roughness={0.6} />
        </mesh>
      )}

      {/* HP bar */}
      <group position={[0, scale * 0.9, 0]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[barWidth, 0.08, 0.01]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
        <mesh position={[-barWidth / 2 + (hpPct * barWidth) / 2, 0, 0.01]}>
          <boxGeometry args={[barWidth * hpPct, 0.07, 0.01]} />
          <meshStandardMaterial
            color={hpPct > 0.6 ? "#6FA38B" : hpPct > 0.3 ? "#C8A45D" : "#D45A35"}
            emissive={hpPct < 0.3 ? "#D45A35" : undefined}
            emissiveIntensity={hpPct < 0.3 ? 0.5 : 0}
          />
        </mesh>
      </group>

      {/* Elite glow ring */}
      {enemy.isElite && (
        <mesh position={[0, -scale * 0.3, 0]}>
          <torusGeometry args={[scale * 0.55, 0.04, 6, 16]} />
          <meshStandardMaterial color="#C8A45D" emissive="#C8A45D" emissiveIntensity={2} />
        </mesh>
      )}

      {/* Shield indicator */}
      {enemy.shieldHp !== undefined && enemy.shieldHp > 0 && (
        <mesh>
          <sphereGeometry args={[scale * 0.7, 8, 8]} />
          <meshStandardMaterial
            color="#5FD7D1"
            transparent
            opacity={0.2}
            wireframe={false}
          />
        </mesh>
      )}
    </group>
  );
}

// ── Towers ──────────────────────────────────────────────────────

const TOWER_VISUAL: Record<string, { color: string; emissive: string; height: number }> = {
  ballista: { color: "#2B323D", emissive: "#C8A45D", height: 1.5 },
  ward_obelisk: { color: "#1a2535", emissive: "#5FD7D1", height: 2.2 },
  flame_mortar: { color: "#3D2020", emissive: "#D45A35", height: 1.0 },
  tesla_spire: { color: "#1a1a35", emissive: "#9B59B6", height: 2.8 },
  barricade_gate: { color: "#2B323D", emissive: "#6FA38B", height: 1.2 },
  rune_mine: { color: "#2B323D", emissive: "#C8A45D", height: 0.3 },
  repair_drone_dock: { color: "#2B3020", emissive: "#6FA38B", height: 0.9 },
};

function TowerMesh({ tower }: { tower: TowerSnapshot }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const visual = TOWER_VISUAL[tower.defId] || TOWER_VISUAL.ballista;
  const isFiring = tower.firing;

  useFrame((_, dt) => {
    if (!meshRef.current) return;
    const targetEmissive = isFiring ? 2.5 : 0.5;
    const mat = meshRef.current.material as THREE.MeshStandardMaterial;
    mat.emissiveIntensity = THREE.MathUtils.lerp(mat.emissiveIntensity, targetEmissive, dt * 8);
  });

  return (
    <group position={[tower.position.x, tower.position.y, tower.position.z]}>
      {/* Base */}
      <mesh receiveShadow castShadow>
        <cylinderGeometry args={[0.5, 0.6, 0.3, 8]} />
        <meshStandardMaterial color={visual.color} roughness={0.5} metalness={0.7} />
      </mesh>

      {/* Tower body */}
      <mesh ref={meshRef} position={[0, visual.height / 2 + 0.15, 0]} castShadow>
        {tower.defId === "barricade_gate" ? (
          <boxGeometry args={[2, visual.height, 0.4]} />
        ) : tower.defId === "rune_mine" ? (
          <cylinderGeometry args={[0.4, 0.5, visual.height, 6]} />
        ) : (
          <cylinderGeometry args={[0.25, 0.4, visual.height, 8]} />
        )}
        <meshStandardMaterial
          color={visual.color}
          emissive={visual.emissive}
          emissiveIntensity={0.5}
          roughness={0.4}
          metalness={0.6}
        />
      </mesh>

      {/* Level indicator gems */}
      {[1, 2, 3].map((lvl) => (
        <mesh
          key={lvl}
          position={[Math.cos((lvl * Math.PI * 2) / 3) * 0.5, 0.2, Math.sin((lvl * Math.PI * 2) / 3) * 0.5]}
        >
          <sphereGeometry args={[0.07, 4, 4]} />
          <meshStandardMaterial
            color={lvl <= tower.level ? visual.emissive : "#2B323D"}
            emissive={lvl <= tower.level ? visual.emissive : undefined}
            emissiveIntensity={lvl <= tower.level ? 1 : 0}
          />
        </mesh>
      ))}

      {/* Disabled indicator */}
      {tower.disabled && (
        <mesh position={[0, visual.height + 0.5, 0]}>
          <sphereGeometry args={[0.2, 6, 6]} />
          <meshStandardMaterial color="#D45A35" emissive="#D45A35" emissiveIntensity={2} />
        </mesh>
      )}
    </group>
  );
}

// ── Projectiles ─────────────────────────────────────────────────

function ProjectileMesh({ proj }: { proj: ProjectileSnapshot }) {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((_, dt) => {
    if (!meshRef.current) return;
    const pos = new THREE.Vector3(proj.position.x, proj.position.y, proj.position.z);
    meshRef.current.position.lerp(pos, dt * 20);
  });
  return (
    <mesh
      ref={meshRef}
      position={[proj.position.x, proj.position.y, proj.position.z]}
    >
      <sphereGeometry args={[0.12, 4, 4]} />
      <meshStandardMaterial
        color={proj.color}
        emissive={proj.color}
        emissiveIntensity={3}
      />
    </mesh>
  );
}

// ── Camera Controller ────────────────────────────────────────────

function CameraController() {
  const { camera } = useThree();
  const { snapshot, cameraAngle } = useGameStore();

  useFrame(() => {
    if (!snapshot) return;

    const { x, y, z } = snapshot.playerPosition;
    const dist = 10;
    const height = 6;

    const camX = x + Math.sin(cameraAngle.horizontal) * dist;
    const camZ = z + Math.cos(cameraAngle.horizontal) * dist;
    const camY = y + height;

    camera.position.lerp(new THREE.Vector3(camX, camY, camZ), 0.1);
    camera.lookAt(x, y + 1, z);
  });

  return null;
}

// ── Scene Root ──────────────────────────────────────────────────

function Scene() {
  const { snapshot } = useGameStore();

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.15} color="#1a2535" />
      <directionalLight
        position={[10, 20, 10]}
        intensity={1.2}
        color="#D8D0BE"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={80}
        shadow-camera-near={0.1}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      <pointLight position={[0, 8, -12]} intensity={2} color="#5FD7D1" distance={20} />
      <pointLight position={[0, 2, 12]} intensity={1.5} color="#D45A35" distance={18} />

      {/* Stars */}
      <Stars radius={80} depth={40} count={1500} factor={3} saturation={0.2} />

      {/* Map */}
      <BattleMap />

      {/* Player */}
      {snapshot && (
        <PlayerMesh
          position={new THREE.Vector3(
            snapshot.playerPosition.x,
            snapshot.playerPosition.y,
            snapshot.playerPosition.z
          )}
          rotation={snapshot.playerRotation}
        />
      )}

      {/* Enemies */}
      {snapshot?.enemies.map((e) => (
        <EnemyMesh key={e.id} enemy={e} />
      ))}

      {/* Towers */}
      {snapshot?.towers.map((t) => (
        <TowerMesh key={t.id} tower={t} />
      ))}

      {/* Projectiles */}
      {snapshot?.projectiles.map((p) => (
        <ProjectileMesh key={p.id} proj={p} />
      ))}

      {/* Camera */}
      <CameraController />
    </>
  );
}

// ── Input Handler ────────────────────────────────────────────────

function InputHandler() {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      gameEngine.input.keys.add(e.code);
    };
    const onKeyUp = (e: KeyboardEvent) => {
      gameEngine.input.keys.delete(e.code);
    };
    const onMouseMove = (e: MouseEvent) => {
      gameEngine.input.mouseDeltaX += e.movementX;
      gameEngine.input.mouseDeltaY += e.movementY;
      gameEngine.input.mouseX = e.clientX;
      gameEngine.input.mouseY = e.clientY;
    };
    const onMouseDown = (e: MouseEvent) => {
      gameEngine.input.mouseButtons.add(e.button);
    };
    const onMouseUp = (e: MouseEvent) => {
      gameEngine.input.mouseButtons.delete(e.button);
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  // Game loop
  useFrame((_, dt) => {
    gameEngine.update(dt);
  });

  return null;
}

// ── Main Canvas Export ───────────────────────────────────────────

export default function GameCanvas() {
  const canvasRef = useRef<HTMLDivElement>(null);

  const requestPointerLock = useCallback(() => {
    canvasRef.current?.requestPointerLock();
  }, []);

  return (
    <div
      ref={canvasRef}
      className="w-full h-full"
      onClick={requestPointerLock}
    >
      <Canvas
        shadows
        camera={{ fov: 60, near: 0.1, far: 200, position: [0, 8, 12] }}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 0.9 }}
        style={{ background: "#070A0F" }}
      >
        <InputHandler />
        <Scene />
      </Canvas>
    </div>
  );
}
