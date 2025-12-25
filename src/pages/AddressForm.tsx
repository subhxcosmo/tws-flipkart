import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import StepIndicator from "@/components/checkout/StepIndicator";
import { useToast } from "@/hooks/use-toast";

const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi", "Chandigarh"
];

const AddressForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    pincode: "",
    city: "",
    state: "",
    houseNo: "",
    area: "",
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.length > 100) {
      newErrors.name = "Name must be less than 100 characters";
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = "Enter valid 10-digit mobile number";
    }
    
    if (!formData.pincode.trim()) {
      newErrors.pincode = "Pincode is required";
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = "Enter valid 6-digit pincode";
    }
    
    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }
    
    if (!formData.state) {
      newErrors.state = "State is required";
    }
    
    if (!formData.houseNo.trim()) {
      newErrors.houseNo = "House/Flat number is required";
    }
    
    if (!formData.area.trim()) {
      newErrors.area = "Area/Road is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    // Save to localStorage
    const address = {
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      address: `${formData.houseNo.trim()}, ${formData.area.trim()}`,
      pincode: formData.pincode.trim(),
      city: formData.city.trim(),
      state: formData.state,
    };
    
    localStorage.setItem('savedAddress', JSON.stringify(address));
    
    toast({
      title: "Address saved",
      description: "Your delivery address has been saved successfully.",
    });
    
    // Navigate back to order summary
    setTimeout(() => {
      navigate(`/checkout/order/${id}`);
    }, 300);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const steps = ["Address", "Order Summary", "Payment"];

  return (
    <>
      <Helmet>
        <title>Add Address | AudioMart</title>
        <meta name="description" content="Add your delivery address" />
      </Helmet>

      <div className="min-h-screen bg-background pb-24">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-card border-b border-border">
          <div className="flex items-center gap-3 px-3 py-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(`/checkout/order/${id}`)}
              className="h-9 w-9 shrink-0"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-base font-semibold text-foreground">Add Delivery Address</h1>
          </div>
        </header>

        {/* Step Indicator */}
        <StepIndicator currentStep={0} steps={steps} />

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-2" autoComplete="off">
          <section className="bg-card px-4 py-4">
            <h2 className="text-sm font-semibold text-foreground mb-4">CONTACT DETAILS</h2>
            
            <div className="space-y-4">
              {/* Full Name */}
              <div>
                <Label htmlFor="name" className="text-xs text-muted-foreground">
                  Full Name *
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter your full name"
                  className={`mt-1 h-11 ${errors.name ? "border-destructive" : ""}`}
                  maxLength={100}
                  autoComplete="off"
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-destructive">{errors.name}</p>
                )}
              </div>
              
              {/* Mobile Number */}
              <div>
                <Label htmlFor="phone" className="text-xs text-muted-foreground">
                  Mobile Number *
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value.replace(/\D/g, "").slice(0, 10))}
                  placeholder="10-digit mobile number"
                  className={`mt-1 h-11 ${errors.phone ? "border-destructive" : ""}`}
                  autoComplete="off"
                />
                {errors.phone && (
                  <p className="mt-1 text-xs text-destructive">{errors.phone}</p>
                )}
              </div>
            </div>
          </section>

          <section className="mt-2 bg-card px-4 py-4">
            <h2 className="text-sm font-semibold text-foreground mb-4">ADDRESS</h2>
            
            <div className="space-y-4">
              {/* Pincode & City Row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="pincode" className="text-xs text-muted-foreground">
                    Pincode *
                  </Label>
                  <Input
                    id="pincode"
                    type="text"
                    value={formData.pincode}
                    onChange={(e) => handleInputChange("pincode", e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="6-digit pincode"
                    className={`mt-1 h-11 ${errors.pincode ? "border-destructive" : ""}`}
                    autoComplete="off"
                  />
                  {errors.pincode && (
                    <p className="mt-1 text-xs text-destructive">{errors.pincode}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="city" className="text-xs text-muted-foreground">
                    City *
                  </Label>
                  <Input
                    id="city"
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    placeholder="City"
                    className={`mt-1 h-11 ${errors.city ? "border-destructive" : ""}`}
                    maxLength={50}
                    autoComplete="off"
                  />
                  {errors.city && (
                    <p className="mt-1 text-xs text-destructive">{errors.city}</p>
                  )}
                </div>
              </div>
              
              {/* State */}
              <div>
                <Label htmlFor="state" className="text-xs text-muted-foreground">
                  State *
                </Label>
                <select
                  id="state"
                  value={formData.state}
                  onChange={(e) => handleInputChange("state", e.target.value)}
                  className={`mt-1 h-11 w-full rounded-md border bg-card px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring ${
                    errors.state ? "border-destructive" : "border-input"
                  }`}
                >
                  <option value="">Select State</option>
                  {indianStates.map((state) => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
                {errors.state && (
                  <p className="mt-1 text-xs text-destructive">{errors.state}</p>
                )}
              </div>
              
              {/* House No */}
              <div>
                <Label htmlFor="houseNo" className="text-xs text-muted-foreground">
                  House No., Building Name *
                </Label>
                <Input
                  id="houseNo"
                  type="text"
                  value={formData.houseNo}
                  onChange={(e) => handleInputChange("houseNo", e.target.value)}
                  placeholder="House/Flat No., Building Name"
                  className={`mt-1 h-11 ${errors.houseNo ? "border-destructive" : ""}`}
                  maxLength={200}
                  autoComplete="off"
                />
                {errors.houseNo && (
                  <p className="mt-1 text-xs text-destructive">{errors.houseNo}</p>
                )}
              </div>
              
              {/* Area */}
              <div>
                <Label htmlFor="area" className="text-xs text-muted-foreground">
                  Road Name, Area, Colony *
                </Label>
                <Input
                  id="area"
                  type="text"
                  value={formData.area}
                  onChange={(e) => handleInputChange("area", e.target.value)}
                  placeholder="Road Name, Area, Colony"
                  className={`mt-1 h-11 ${errors.area ? "border-destructive" : ""}`}
                  maxLength={200}
                  autoComplete="off"
                />
                {errors.area && (
                  <p className="mt-1 text-xs text-destructive">{errors.area}</p>
                )}
              </div>
            </div>
          </section>

          {/* Save Button */}
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border px-4 py-3 shadow-lg">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 bg-cta hover:bg-cta/90 text-cta-foreground font-semibold text-sm"
            >
              {isSubmitting ? "SAVING..." : "SAVE ADDRESS"}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddressForm;
