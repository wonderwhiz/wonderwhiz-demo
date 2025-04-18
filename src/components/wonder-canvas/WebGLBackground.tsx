
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

interface WebGLBackgroundProps {
  timeOfDay: 'morning' | 'afternoon' | 'evening';
  intensity?: number;
  particleCount?: number;
  interactive?: boolean;
  lowPerformance?: boolean;
}

const WebGLBackground: React.FC<WebGLBackgroundProps> = ({
  timeOfDay,
  intensity = 1.0,
  particleCount = 1000,
  interactive = true,
  lowPerformance = false
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2(0, 0));
  const frameIdRef = useRef<number>(0);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Initialize Three.js scene
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    // Create renderer with alpha transparency
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: !lowPerformance,
      powerPreference: lowPerformance ? 'low-power' : 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(lowPerformance ? 1 : window.devicePixelRatio);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    
    // Create scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    
    // Create camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 50;
    cameraRef.current = camera;
    
    // Create particles
    const getColorFromTimeOfDay = () => {
      switch (timeOfDay) {
        case 'morning':
          return new THREE.Color(0xffb347); // Warm orange
        case 'afternoon':
          return new THREE.Color(0x4287f5); // Bright blue
        case 'evening':
          return new THREE.Color(0x7b2cbf); // Deep purple
        default:
          return new THREE.Color(0x7b2cbf);
      }
    };
    
    const createParticles = () => {
      const adjustedCount = lowPerformance ? particleCount / 3 : particleCount;
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(adjustedCount * 3);
      const colors = new Float32Array(adjustedCount * 3);
      const sizes = new Float32Array(adjustedCount);
      
      const color = getColorFromTimeOfDay();
      const baseColor = new THREE.Color(color.r, color.g, color.b);
      
      for (let i = 0; i < adjustedCount; i++) {
        // Random positions in a sphere
        const radius = 30 * Math.cbrt(Math.random()) * intensity;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);
        
        positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = radius * Math.cos(phi);
        
        // Slight color variation
        const variationColor = new THREE.Color(
          baseColor.r + (Math.random() * 0.2 - 0.1),
          baseColor.g + (Math.random() * 0.2 - 0.1),
          baseColor.b + (Math.random() * 0.2 - 0.1)
        );
        
        colors[i * 3] = variationColor.r;
        colors[i * 3 + 1] = variationColor.g;
        colors[i * 3 + 2] = variationColor.b;
        
        // Random sizes
        sizes[i] = Math.random() * 2 + 0.5;
      }
      
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
      
      const material = new THREE.PointsMaterial({
        size: 0.1,
        vertexColors: true,
        transparent: true,
        opacity: 0.7,
        sizeAttenuation: true
      });
      
      if (!lowPerformance) {
        // Use a custom shader for better particle effects
        const customMaterial = new THREE.ShaderMaterial({
          uniforms: {
            pointTexture: { value: new THREE.TextureLoader().load('/patterns/particle.png') },
            time: { value: 0 }
          },
          vertexShader: `
            attribute float size;
            varying vec3 vColor;
            uniform float time;
            void main() {
              vColor = color;
              vec3 pos = position;
              pos.x += sin(time * 0.2 + position.z * 0.05) * 0.5;
              pos.y += cos(time * 0.1 + position.x * 0.05) * 0.5;
              vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
              gl_PointSize = size * (300.0 / -mvPosition.z);
              gl_Position = projectionMatrix * mvPosition;
            }
          `,
          fragmentShader: `
            varying vec3 vColor;
            uniform sampler2D pointTexture;
            void main() {
              gl_FragColor = vec4(vColor, 1.0) * texture2D(pointTexture, gl_PointCoord);
            }
          `,
          transparent: true
        });
        
        const particles = new THREE.Points(geometry, customMaterial);
        scene.add(particles);
        particlesRef.current = particles;
      } else {
        // Use simpler material for low-performance devices
        const particles = new THREE.Points(geometry, material);
        scene.add(particles);
        particlesRef.current = particles;
      }
    };
    
    createParticles();
    
    // Handle mouse movement
    const handleMouseMove = (event: MouseEvent) => {
      if (!interactive) return;
      mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    
    // Handle touch movement
    const handleTouchMove = (event: TouchEvent) => {
      if (!interactive || event.touches.length === 0) return;
      mouseRef.current.x = (event.touches[0].clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(event.touches[0].clientY / window.innerHeight) * 2 + 1;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);
    
    // Handle resize
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
      
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Animation loop
    let time = 0;
    const animate = () => {
      frameIdRef.current = requestAnimationFrame(animate);
      time += 0.01;
      
      if (particlesRef.current && particlesRef.current.material instanceof THREE.ShaderMaterial) {
        particlesRef.current.material.uniforms.time.value = time;
      }
      
      if (particlesRef.current && interactive) {
        // Make particles respond to mouse/touch
        particlesRef.current.rotation.x += (mouseRef.current.y * 0.01 - particlesRef.current.rotation.x) * 0.05;
        particlesRef.current.rotation.y += (mouseRef.current.x * 0.01 - particlesRef.current.rotation.y) * 0.05;
      } else if (particlesRef.current) {
        // Gentle auto-rotation
        particlesRef.current.rotation.y += 0.001;
        particlesRef.current.rotation.x += 0.0005;
      }
      
      rendererRef.current?.render(sceneRef.current!, cameraRef.current!);
    };
    
    animate();
    
    // Cleanup
    return () => {
      cancelAnimationFrame(frameIdRef.current);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('resize', handleResize);
      
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
      
      rendererRef.current?.dispose();
      
      // Dispose of geometries and materials
      if (particlesRef.current) {
        const geometry = particlesRef.current.geometry;
        const material = particlesRef.current.material;
        
        geometry.dispose();
        
        if (Array.isArray(material)) {
          material.forEach(m => m.dispose());
        } else {
          material.dispose();
        }
      }
    };
  }, [timeOfDay, intensity, particleCount, interactive, lowPerformance]);
  
  return <div ref={containerRef} className="absolute inset-0 z-0 pointer-events-none" />;
};

export default WebGLBackground;
