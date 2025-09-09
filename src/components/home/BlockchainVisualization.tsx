import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Node {
  id: string;
  x: number;
  y: number;
  size: number;
  color: string;
  connections: string[];
  data: {
    type: 'transaction' | 'block' | 'validator';
    value?: number;
    timestamp: number;
  };
}

interface Connection {
  from: string;
  to: string;
  strength: number;
  animated: boolean;
}

const BlockchainVisualization = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Initialize nodes
  useEffect(() => {
    const initialNodes: Node[] = [
      {
        id: 'genesis',
        x: 10,
        y: 50,
        size: 12,
        color: '#ffd700',
        connections: ['block1', 'validator1'],
        data: { type: 'block', timestamp: Date.now() - 86400000 }
      },
      {
        id: 'block1',
        x: 25,
        y: 30,
        size: 10,
        color: '#ffb347',
        connections: ['block2', 'tx1'],
        data: { type: 'block', timestamp: Date.now() - 43200000 }
      },
      {
        id: 'block2',
        x: 45,
        y: 60,
        size: 10,
        color: '#ffd700',
        connections: ['block3', 'tx2'],
        data: { type: 'block', timestamp: Date.now() - 21600000 }
      },
      {
        id: 'block3',
        x: 65,
        y: 25,
        size: 10,
        color: '#ffb347',
        connections: ['validator2', 'tx3'],
        data: { type: 'block', timestamp: Date.now() - 10800000 }
      },
      {
        id: 'validator1',
        x: 20,
        y: 75,
        size: 8,
        color: '#00ff88',
        connections: ['validator2', 'tx1'],
        data: { type: 'validator', timestamp: Date.now() - 3600000 }
      },
      {
        id: 'validator2',
        x: 70,
        y: 70,
        size: 8,
        color: '#00ff88',
        connections: ['tx3'],
        data: { type: 'validator', timestamp: Date.now() - 1800000 }
      },
      {
        id: 'tx1',
        x: 35,
        y: 45,
        size: 6,
        color: '#ff6b6b',
        connections: ['tx2'],
        data: { type: 'transaction', value: 2.5, timestamp: Date.now() - 900000 }
      },
      {
        id: 'tx2',
        x: 55,
        y: 40,
        size: 6,
        color: '#ff6b6b',
        connections: ['tx3'],
        data: { type: 'transaction', value: 1.8, timestamp: Date.now() - 450000 }
      },
      {
        id: 'tx3',
        x: 75,
        y: 45,
        size: 6,
        color: '#ff6b6b',
        connections: [],
        data: { type: 'transaction', value: 3.2, timestamp: Date.now() - 225000 }
      },
      {
        id: 'pending1',
        x: 85,
        y: 35,
        size: 5,
        color: '#ffa500',
        connections: [],
        data: { type: 'transaction', value: 0.9, timestamp: Date.now() - 60000 }
      },
      {
        id: 'pending2',
        x: 90,
        y: 55,
        size: 5,
        color: '#ffa500',
        connections: [],
        data: { type: 'transaction', value: 1.2, timestamp: Date.now() - 30000 }
      }
    ];

    setNodes(initialNodes);

    // Generate connections
    const newConnections: Connection[] = [];
    initialNodes.forEach(node => {
      node.connections.forEach(targetId => {
        newConnections.push({
          from: node.id,
          to: targetId,
          strength: Math.random() * 0.8 + 0.2,
          animated: Math.random() > 0.5
        });
      });
    });
    setConnections(newConnections);
  }, []);

  // Add new transactions periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const newNode: Node = {
        id: `tx_${Date.now()}`,
        x: 85 + Math.random() * 10,
        y: 30 + Math.random() * 40,
        size: 4 + Math.random() * 3,
        color: '#ffa500',
        connections: [],
        data: {
          type: 'transaction',
          value: Math.random() * 5,
          timestamp: Date.now()
        }
      };

      setNodes(prev => {
        const updated = [...prev, newNode];
        // Keep only last 15 nodes
        return updated.slice(-15);
      });

      // Animate node to connect to network
      setTimeout(() => {
        setNodes(prev => prev.map(node => 
          node.id === newNode.id 
            ? { ...node, x: node.x - 10, color: '#ff6b6b' }
            : node
        ));
      }, 1000);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100
        });
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      return () => container.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  const getNodeTypeIcon = (type: string) => {
    switch (type) {
      case 'block': return '⬢';
      case 'validator': return '⚡';
      case 'transaction': return '💎';
      default: return '●';
    }
  };

  const formatValue = (value?: number) => {
    return value ? `${value.toFixed(2)} ETH` : '';
  };

  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return `${minutes}m ago`;
  };

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 w-full h-full overflow-hidden pointer-events-auto"
      style={{ zIndex: 5 }}
    >
      {/* Connection Lines */}
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          <linearGradient id="connection-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffd700" stopOpacity="0.6"/>
            <stop offset="50%" stopColor="#ffb347" stopOpacity="0.3"/>
            <stop offset="100%" stopColor="#ffd700" stopOpacity="0.6"/>
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {connections.map((connection, index) => {
          const fromNode = nodes.find(n => n.id === connection.from);
          const toNode = nodes.find(n => n.id === connection.to);
          
          if (!fromNode || !toNode) return null;
          
          return (
            <motion.line
              key={`${connection.from}-${connection.to}`}
              x1={`${fromNode.x}%`}
              y1={`${fromNode.y}%`}
              x2={`${toNode.x}%`}
              y2={`${toNode.y}%`}
              stroke="url(#connection-gradient)"
              strokeWidth={connection.strength * 2}
              filter="url(#glow)"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ 
                pathLength: 1, 
                opacity: connection.animated ? [0.3, 0.8, 0.3] : 0.5
              }}
              transition={{
                pathLength: { duration: 2, delay: index * 0.1 },
                opacity: connection.animated ? {
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse"
                } : { duration: 0.5 }
              }}
            />
          );
        })}
      </svg>

      {/* Nodes */}
      {nodes.map((node, index) => (
        <motion.div
          key={node.id}
          className="absolute cursor-pointer group"
          style={{
            left: `${node.x}%`,
            top: `${node.y}%`,
            transform: 'translate(-50%, -50%)'
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: index * 0.1, type: "spring", stiffness: 200 }}
          whileHover={{ scale: 1.5, zIndex: 10 }}
          onHoverStart={() => setHoveredNode(node.id)}
          onHoverEnd={() => setHoveredNode(null)}
        >
          {/* Node Core */}
          <motion.div
            className="relative flex items-center justify-center rounded-full border-2 backdrop-blur-sm"
            style={{
              width: `${node.size}px`,
              height: `${node.size}px`,
              backgroundColor: `${node.color}20`,
              borderColor: node.color,
              boxShadow: `0 0 ${node.size}px ${node.color}40`
            }}
            animate={{
              boxShadow: [
                `0 0 ${node.size}px ${node.color}40`,
                `0 0 ${node.size * 1.5}px ${node.color}60`,
                `0 0 ${node.size}px ${node.color}40`
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-xs" style={{ color: node.color }}>
              {getNodeTypeIcon(node.data.type)}
            </span>
          </motion.div>

          {/* Pulse Effect */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 opacity-50"
            style={{ borderColor: node.color }}
            animate={{ scale: [1, 2, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
          />

          {/* Tooltip */}
          <AnimatePresence>
            {hoveredNode === node.id && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 10 }}
                className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-black/90 backdrop-blur-sm border border-yellow-400/30 rounded-lg p-2 text-xs text-white whitespace-nowrap z-20"
              >
                <div className="font-semibold text-yellow-400 capitalize">
                  {node.data.type}
                </div>
                {node.data.value && (
                  <div className="text-yellow-400">
                    {formatValue(node.data.value)}
                  </div>
                )}
                <div className="text-gray-400">
                  {formatTime(node.data.timestamp)}
                </div>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-yellow-400/30" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}

      {/* Mouse Interaction Effect */}
      <motion.div
        className="absolute pointer-events-none"
        style={{
          left: `${mousePosition.x}%`,
          top: `${mousePosition.y}%`,
          transform: 'translate(-50%, -50%)'
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-32 h-32 rounded-full bg-gradient-radial from-yellow-400/20 to-transparent" />
      </motion.div>

      {/* Network Stats */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm border border-yellow-400/30 rounded-lg p-3 text-xs text-white"
      >
        <div className="font-semibold text-yellow-400 mb-1">Network Status</div>
        <div className="space-y-1">
          <div className="flex justify-between">
            <span className="text-gray-400">Nodes:</span>
            <span className="text-yellow-400">{nodes.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Connections:</span>
            <span className="text-yellow-400">{connections.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">TPS:</span>
            <span className="text-yellow-400">2,847</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default BlockchainVisualization;