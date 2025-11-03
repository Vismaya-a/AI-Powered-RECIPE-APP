import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from './ui/dialog';
import {
    X,
    Plus,
    ChefHat,
    Clock,
    Flame,
    Leaf,
    Droplets,
    AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { api } from '../utils/api';

interface TasteProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
    isFirstTime?: boolean;
}

const dietaryOptions = [
    'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Keto', 'Paleo',
    'Low-Carb', 'Mediterranean', 'Asian', 'Italian', 'Mexican'
];

const oilPreferences = ['Light', 'Moderate', 'Heavy'];

export default function TasteProfileModal({
    isOpen,
    onClose,
    onSave,
    isFirstTime = false
}: TasteProfileModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [profile, setProfile] = useState({
        likes: [] as string[],
        dislikes: [] as string[],
        dietary_preferences: [] as string[],
        allergies: [] as string[],
        spice_level: 2,
        oil_preference: 'Moderate',
        cooking_time_preference: 30
    });

    const [newLike, setNewLike] = useState('');
    const [newDislike, setNewDislike] = useState('');
    const [newAllergy, setNewAllergy] = useState('');

    useEffect(() => {
        if (isOpen && !isFirstTime) {
            loadTasteProfile();
        }
    }, [isOpen, isFirstTime]);

    const loadTasteProfile = async () => {
        try {
            const tasteProfile = await api.getTasteProfile();
            setProfile({
                likes: tasteProfile.likes || [],
                dislikes: tasteProfile.dislikes || [],
                dietary_preferences: tasteProfile.dietary_preferences || [],
                allergies: tasteProfile.allergies || [],
                spice_level: tasteProfile.spice_level || 2,
                oil_preference: tasteProfile.oil_preference || 'Moderate',
                cooking_time_preference: tasteProfile.cooking_time_preference || 30
            });
        } catch (error) {
            console.error('Error loading taste profile:', error);
        }
    };

    // const handleSave = async () => {
    //     try {
    //         setIsLoading(true);

    //         if (isFirstTime) {
    //             await api.createTasteProfile(profile);
    //             toast.success('Taste profile created successfully!');
    //         } else {
    //             await api.updateTasteProfile(profile);
    //             toast.success('Taste profile updated successfully!');
    //         }

    //         onSave();
    //         onClose();
    //     } catch (error: any) {
    //         console.error('Error saving taste profile:', error);
    //         toast.error('Failed to save taste profile');
    //     } finally {
    //         setIsLoading(false);
    //     }
    // };
    // const handleSave = async () => {
    //     try {
    //         setIsLoading(true);

    //         // Debug: Check if we have a token
    //         const token = localStorage.getItem('token');
    //         console.log('TasteProfileModal - Token:', token);
    //         console.log('TasteProfileModal - Profile data:', profile);

    //         if (isFirstTime) {
    //             await api.createTasteProfile(profile);
    //             toast.success('Taste profile created successfully!');
    //         } else {
    //             await api.updateTasteProfile(profile);
    //             toast.success('Taste profile updated successfully!');
    //         }

    //         onSave();
    //         onClose();
    //     } catch (error: any) {
    //         console.error('Error saving taste profile:', error);
    //         toast.error(error.message || 'Failed to save taste profile');
    //     } finally {
    //         setIsLoading(false);
    //     }
    // };
    const handleSave = async () => {
        try {
            setIsLoading(true);

            console.log('Saving taste profile...');

            // Always use getOrCreate to handle both new and existing profiles
            const existingProfile = await api.getOrCreateTasteProfile();
            console.log('Existing profile:', existingProfile);

            // Update with new data
            await api.updateTasteProfile(profile);

            toast.success('Taste profile saved successfully!');
            onSave();
            onClose();

        } catch (error: any) {
            console.error('Error saving taste profile:', error);
            toast.error(error.message || 'Failed to save taste profile');
        } finally {
            setIsLoading(false);
        }
    };
    const addItem = (list: string[], setList: (items: string[]) => void, newItem: string, setNewItem: (item: string) => void) => {
        if (newItem.trim() && !list.includes(newItem.trim())) {
            setList([...list, newItem.trim()]);
            setNewItem('');
        }
    };

    const removeItem = (list: string[], setList: (items: string[]) => void, item: string) => {
        setList(list.filter(i => i !== item));
    };

    const toggleDietaryPreference = (preference: string) => {
        const updated = profile.dietary_preferences.includes(preference)
            ? profile.dietary_preferences.filter(p => p !== preference)
            : [...profile.dietary_preferences, preference];
        setProfile({ ...profile, dietary_preferences: updated });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl flex items-center gap-2">
                        <ChefHat className="h-6 w-6 text-primary" />
                        {isFirstTime ? 'Set Up Your Taste Profile' : 'Edit Taste Profile'}
                    </DialogTitle>
                    <DialogDescription className="text-lg">
                        {isFirstTime
                            ? 'Tell us about your food preferences to get personalized recipe recommendations'
                            : 'Update your food preferences and dietary requirements'
                        }
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-8 py-4">
                    {/* Likes & Dislikes */}
                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Likes */}
                        <div className="space-y-4">
                            <Label htmlFor="likes" className="text-base font-semibold">
                                Foods You Love ❤️
                            </Label>
                            <div className="flex gap-2">
                                <Input
                                    id="likes"
                                    placeholder="Add favorite ingredients..."
                                    value={newLike}
                                    onChange={(e) => setNewLike(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && addItem(profile.likes, (items) => setProfile({ ...profile, likes: items }), newLike, setNewLike)}
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => addItem(profile.likes, (items) => setProfile({ ...profile, likes: items }), newLike, setNewLike)}
                                >
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {profile.likes.map((like) => (
                                    <Badge key={like} variant="secondary" className="flex items-center gap-1 bg-green-100 text-green-800">
                                        {like}
                                        <X
                                            className="h-3 w-3 cursor-pointer"
                                            onClick={() => removeItem(profile.likes, (items) => setProfile({ ...profile, likes: items }), like)}
                                        />
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        {/* Dislikes */}
                        <div className="space-y-4">
                            <Label htmlFor="dislikes" className="text-base font-semibold">
                                Foods You Avoid 🚫
                            </Label>
                            <div className="flex gap-2">
                                <Input
                                    id="dislikes"
                                    placeholder="Add ingredients to avoid..."
                                    value={newDislike}
                                    onChange={(e) => setNewDislike(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && addItem(profile.dislikes, (items) => setProfile({ ...profile, dislikes: items }), newDislike, setNewDislike)}
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => addItem(profile.dislikes, (items) => setProfile({ ...profile, dislikes: items }), newDislike, setNewDislike)}
                                >
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {profile.dislikes.map((dislike) => (
                                    <Badge key={dislike} variant="secondary" className="flex items-center gap-1 bg-red-100 text-red-800">
                                        {dislike}
                                        <X
                                            className="h-3 w-3 cursor-pointer"
                                            onClick={() => removeItem(profile.dislikes, (items) => setProfile({ ...profile, dislikes: items }), dislike)}
                                        />
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Dietary Preferences */}
                    <div className="space-y-4">
                        <Label className="text-base font-semibold flex items-center gap-2">
                            <Leaf className="h-4 w-4 text-green-600" />
                            Dietary Preferences
                        </Label>
                        <div className="flex flex-wrap gap-2">
                            {dietaryOptions.map((preference) => (
                                <Badge
                                    key={preference}
                                    variant={profile.dietary_preferences.includes(preference) ? "default" : "outline"}
                                    className="cursor-pointer transition-all hover:scale-105"
                                    onClick={() => toggleDietaryPreference(preference)}
                                >
                                    {preference}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    {/* Allergies */}
                    <div className="space-y-4">
                        <Label htmlFor="allergies" className="text-base font-semibold flex items-center gap-2">
                            <AlertCircle className="h-4 w-4 text-orange-600" />
                            Allergies & Restrictions
                        </Label>
                        <div className="flex gap-2">
                            <Input
                                id="allergies"
                                placeholder="Add allergies or restrictions..."
                                value={newAllergy}
                                onChange={(e) => setNewAllergy(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && addItem(profile.allergies, (items) => setProfile({ ...profile, allergies: items }), newAllergy, setNewAllergy)}
                            />
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => addItem(profile.allergies, (items) => setProfile({ ...profile, allergies: items }), newAllergy, setNewAllergy)}
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {profile.allergies.map((allergy) => (
                                <Badge key={allergy} variant="secondary" className="flex items-center gap-1 bg-orange-100 text-orange-800">
                                    {allergy}
                                    <X
                                        className="h-3 w-3 cursor-pointer"
                                        onClick={() => removeItem(profile.allergies, (items) => setProfile({ ...profile, allergies: items }), allergy)}
                                    />
                                </Badge>
                            ))}
                        </div>
                    </div>

                    {/* Spice Level & Oil Preference */}
                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Spice Level */}
                        <div className="space-y-4">
                            <Label className="text-base font-semibold flex items-center gap-2">
                                <Flame className="h-4 w-4 text-red-600" />
                                Spice Level: {profile.spice_level}/5
                            </Label>
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-muted-foreground">Mild</span>
                                <input
                                    type="range"
                                    min="1"
                                    max="5"
                                    value={profile.spice_level}
                                    onChange={(e) => setProfile({ ...profile, spice_level: parseInt(e.target.value) })}
                                    className="flex-1"
                                />
                                <span className="text-sm text-muted-foreground">Spicy</span>
                            </div>
                            <div className="text-sm text-muted-foreground">
                                {profile.spice_level === 1 && 'Very mild - no spice'}
                                {profile.spice_level === 2 && 'Mild - light seasoning'}
                                {profile.spice_level === 3 && 'Medium - balanced spice'}
                                {profile.spice_level === 4 && 'Spicy - noticeable heat'}
                                {profile.spice_level === 5 && 'Very spicy - maximum heat'}
                            </div>
                        </div>

                        {/* Oil Preference */}
                        <div className="space-y-4">
                            <Label className="text-base font-semibold flex items-center gap-2">
                                <Droplets className="h-4 w-4 text-blue-600" />
                                Oil Preference
                            </Label>
                            <div className="flex gap-2">
                                {oilPreferences.map((preference) => (
                                    <Button
                                        key={preference}
                                        type="button"
                                        variant={profile.oil_preference === preference ? "default" : "outline"}
                                        onClick={() => setProfile({ ...profile, oil_preference: preference })}
                                        className="flex-1"
                                    >
                                        {preference}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Cooking Time Preference */}
                    <div className="space-y-4">
                        <Label className="text-base font-semibold flex items-center gap-2">
                            <Clock className="h-4 w-4 text-purple-600" />
                            Preferred Cooking Time: {profile.cooking_time_preference} minutes
                        </Label>
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-muted-foreground">Quick (15min)</span>
                            <input
                                type="range"
                                min="15"
                                max="120"
                                step="15"
                                value={profile.cooking_time_preference}
                                onChange={(e) => setProfile({ ...profile, cooking_time_preference: parseInt(e.target.value) })}
                                className="flex-1"
                            />
                            <span className="text-sm text-muted-foreground">Relaxed (2hr)</span>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    {!isFirstTime && (
                        <Button variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                    )}
                    <Button onClick={handleSave} disabled={isLoading} className="min-w-24">
                        {isLoading ? 'Saving...' : isFirstTime ? 'Get Started' : 'Save Changes'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}