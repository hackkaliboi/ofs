import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { ArrowRight, Shield, Zap, Users, Coins, Code, ChevronRight, Star, Award, TrendingUp, Info, AlertCircle } from "lucide-react";
import Footer from "@/components/layout/Footer";

const CreateToken = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    tokenName: "",
    tokenSymbol: "",
    tokenSupply: "1000000",
    decimals: 18,
    description: "",
    blockchain: "ethereum",
    tokenType: "erc20",
    isMintable: true,
    isBurnable: true,
    isPausable: false,
    taxFee: 0,
    logo: null
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSwitchChange = (name, checked) => {
    setFormData({
      ...formData,
      [name]: checked
    });
  };

  const handleSelectChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSliderChange = (value) => {
    setFormData({
      ...formData,
      taxFee: value[0]
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        logo: file
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log("Token creation data:", formData);
    toast({
      title: "Token Creation Initiated",
      description: `Your ${formData.tokenName} (${formData.tokenSymbol}) token is being created. You'll be notified when it's ready.`,
    });
  };

  const blockchainOptions = [
    { value: "ethereum", label: "Ethereum" },
    { value: "binance", label: "Binance Smart Chain" },
    { value: "polygon", label: "Polygon" },
    { value: "solana", label: "Solana" },
    { value: "avalanche", label: "Avalanche" }
  ];
  
  const tokenTypeOptions = [
    { value: "erc20", label: "ERC-20 (Ethereum)" },
    { value: "bep20", label: "BEP-20 (Binance)" },
    { value: "spl", label: "SPL (Solana)" }
  ];

  const features = [
    {
      icon: Shield,
      title: "Secure Token Creation",
      description: "Industry-leading security protocols to create and deploy your tokens with confidence."
    },
    {
      icon: Zap,
      title: "Instant Deployment",
      description: "Deploy your token to the blockchain in minutes, not days."
    },
    {
      icon: Users,
      title: "Community Building Tools",
      description: "Integrated tools to help you build and manage your token community."
    },
    {
      icon: Coins,
      title: "Multiple Blockchain Support",
      description: "Create tokens on Ethereum, Binance Smart Chain, Polygon, and more."
    },
    {
      icon: Code,
      title: "Customizable Smart Contracts",
      description: "Tailor your token's functionality with customizable smart contract features."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white relative overflow-hidden">
      {/* Premium Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 via-transparent to-amber-400/5" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl" />
      </div>
      
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-16">
          {/* Hero Section */}
          <motion.div 
            className="max-w-4xl mx-auto text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400/20 to-amber-400/20 border border-yellow-400/30 rounded-full px-6 py-2 mb-8"
            >
              <Star className="h-4 w-4 text-yellow-400" />
              <span className="text-sm font-medium text-yellow-400">Token Creation Platform</span>
            </motion.div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500 bg-clip-text text-transparent leading-tight">
              Create Your Own Token in Minutes
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Launch your cryptocurrency token on multiple blockchains with our easy-to-use platform.
              No coding required, fully customizable, and secure deployment.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-12 gap-8 mb-20">
            {/* Token Creation Form */}
            <motion.div 
              className="md:col-span-7 lg:col-span-8"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Card className="border-yellow-400/20 backdrop-blur-sm" style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)' }}>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">Token Details</h2>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="tokenName" className="text-white">Token Name*</Label>
                        <Input
                          id="tokenName"
                          name="tokenName"
                          placeholder="e.g., My Awesome Token"
                          value={formData.tokenName}
                          onChange={handleInputChange}
                          required
                          className="bg-black/50 border-yellow-500/30"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="tokenSymbol" className="text-white">Token Symbol*</Label>
                        <Input
                          id="tokenSymbol"
                          name="tokenSymbol"
                          placeholder="e.g., MAT"
                          value={formData.tokenSymbol}
                          onChange={handleInputChange}
                          required
                          className="bg-black/50 border-yellow-500/30"
                          maxLength={10}
                        />
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="tokenSupply" className="text-white">Initial Supply*</Label>
                        <Input
                          id="tokenSupply"
                          name="tokenSupply"
                          type="number"
                          placeholder="e.g., 1000000"
                          value={formData.tokenSupply}
                          onChange={handleInputChange}
                          required
                          className="bg-black/50 border-yellow-500/30"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="decimals" className="text-white">Decimals*</Label>
                        <Input
                          id="decimals"
                          name="decimals"
                          type="number"
                          placeholder="e.g., 18"
                          value={formData.decimals}
                          onChange={handleInputChange}
                          required
                          className="bg-black/50 border-yellow-500/30"
                          min={0}
                          max={18}
                        />
                        <p className="text-xs text-gray-400">Standard is 18 for ERC-20 tokens</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description" className="text-white">Token Description</Label>
                      <Textarea
                        id="description"
                        name="description"
                        placeholder="Describe your token and its purpose..."
                        value={formData.description}
                        onChange={handleInputChange}
                        className="bg-black/50 border-yellow-500/30 min-h-[100px]"
                      />
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="blockchain" className="text-white">Blockchain*</Label>
                        <Select 
                          value={formData.blockchain} 
                          onValueChange={(value) => handleSelectChange("blockchain", value)}
                        >
                          <SelectTrigger className="bg-black/50 border-yellow-500/30">
                            <SelectValue placeholder="Select blockchain" />
                          </SelectTrigger>
                          <SelectContent>
                            {blockchainOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="tokenType" className="text-white">Token Type*</Label>
                        <Select 
                          value={formData.tokenType} 
                          onValueChange={(value) => handleSelectChange("tokenType", value)}
                        >
                          <SelectTrigger className="bg-black/50 border-yellow-500/30">
                            <SelectValue placeholder="Select token type" />
                          </SelectTrigger>
                          <SelectContent>
                            {tokenTypeOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-white">Token Features</h3>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="isMintable" className="text-white">Mintable</Label>
                          <p className="text-xs text-gray-400">Ability to create more tokens in the future</p>
                        </div>
                        <Switch
                          id="isMintable"
                          checked={formData.isMintable}
                          onCheckedChange={(checked) => handleSwitchChange("isMintable", checked)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="isBurnable" className="text-white">Burnable</Label>
                          <p className="text-xs text-gray-400">Ability to permanently remove tokens from circulation</p>
                        </div>
                        <Switch
                          id="isBurnable"
                          checked={formData.isBurnable}
                          onCheckedChange={(checked) => handleSwitchChange("isBurnable", checked)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="isPausable" className="text-white">Pausable</Label>
                          <p className="text-xs text-gray-400">Ability to pause token transfers in case of emergency</p>
                        </div>
                        <Switch
                          id="isPausable"
                          checked={formData.isPausable}
                          onCheckedChange={(checked) => handleSwitchChange("isPausable", checked)}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label htmlFor="taxFee" className="text-white">Transaction Tax/Fee ({formData.taxFee}%)</Label>
                        <span className="text-sm text-gray-400">{formData.taxFee}%</span>
                      </div>
                      <Slider
                        id="taxFee"
                        defaultValue={[0]}
                        max={10}
                        step={0.1}
                        value={[formData.taxFee]}
                        onValueChange={handleSliderChange}
                        className="py-4"
                      />
                      <p className="text-xs text-gray-400">Percentage fee applied to each transaction (0-10%)</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="logo" className="text-white">Token Logo (Optional)</Label>
                      <Input
                        id="logo"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="bg-black/50 border-yellow-500/30"
                      />
                      <p className="text-xs text-gray-400">Recommended size: 200x200px, PNG format</p>
                    </div>
                    
                    <div className="bg-yellow-50/10 border border-yellow-400/20 rounded-lg p-4 flex gap-3">
                      <AlertCircle className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium text-yellow-400">Important Information</h4>
                        <p className="text-xs text-gray-300 mt-1">
                          Creating a token requires a blockchain transaction that will incur network fees.
                          Make sure you have enough native currency (ETH, BNB, etc.) in your wallet to cover gas fees.
                        </p>
                      </div>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-black font-semibold py-3 rounded-lg transition-all duration-300"
                    >
                      Create Token
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
            
            {/* Features Section */}
            <motion.div 
              className="md:col-span-5 lg:col-span-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <div className="space-y-6">
                <Card className="border-yellow-400/20 backdrop-blur-sm" style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)' }}>
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">Platform Benefits</h2>
                    
                    <div className="space-y-6">
                      {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                          <div key={index} className="flex gap-4">
                            <div className="bg-gradient-to-br from-yellow-400/20 to-amber-400/20 p-2 rounded-lg border border-yellow-400/30 h-fit">
                              <Icon className="h-5 w-5 text-yellow-400" />
                            </div>
                            <div>
                              <h3 className="font-medium text-white">{feature.title}</h3>
                              <p className="text-sm text-gray-300 mt-1">{feature.description}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
                

              </div>
            </motion.div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default CreateToken;