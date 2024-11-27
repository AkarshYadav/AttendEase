'use client';

import { useKey } from './KeyContext';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Loader2, Copy, Check, MapPin, Clock, Users, AlertTriangle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const StudentView = ({ classData, isActive, hasMarked, timeLeft, progressValue, onMarkAttendance }) => {
    const [enteredKey, setEnteredKey] = useState('');
    const [error, setError] = useState('');
    const { uniqueKey, prevKey } = useKey();

    const handleKeyChange = (e) => setEnteredKey(e.target.value);

    const handleAttendanceMark = () => {
        let timestamp = Date.now() - Date.now() % 100000;
        timestamp = timestamp / 100000;
        let key = `key_${timestamp}`;

        // const isValidKey =
        //     enteredKey === uniqueKey ||
        //     enteredKey === prevKey || 
        //     enteredKey === key;

        if (enteredKey === key) {
            onMarkAttendance();
            setError('');
        } else {
            // setError(`Invalid key.key= ${uniqueKey}, ${prevKey}, key= ${key}`);
            setError(`Invalid key. Please use the current attendance key.`);
        }
    };

    return (
        <div className="space-y-4">
            {classData?.description && (
                <div>
                    <h3 className="text-lg font-semibold mb-2">About this class</h3>
                    <p className="text-muted-foreground">{classData.description}</p>
                </div>
            )}

            {isActive && (
                <Card className="bg-secondary">
                    <CardContent className="pt-6">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Clock className="h-5 w-5 text-primary" />
                                    <span className="font-medium">Attendance Session Active</span>
                                </div>
                                <span className="text-sm font-medium">{timeLeft} remaining</span>
                            </div>

                            <Progress value={progressValue} className="w-full" />

                            {!hasMarked ? (
                                <div className="w-full flex flex-col">
                                    <div className="flex my-5">
                                        <p className="text-sm text-muted-foreground w-2/3 flex items-center">
                                            Enter the unique key provided to you to mark your attendance.
                                        </p>
                                        <input
                                            type="text"
                                            value={enteredKey}
                                            onChange={handleKeyChange}
                                            placeholder="Enter your key"
                                            className="w-1/3 p-2 border border-gray-300 rounded"
                                        />
                                    </div>

                                    {error && (
                                        <div className="text-red-500 mb-4">
                                            <p>{error}</p>
                                        </div>
                                    )}

                                    <Button
                                        onClick={handleAttendanceMark}
                                        className="w-full"
                                        disabled={!enteredKey}
                                    >
                                        <MapPin className="h-4 w-4 mr-2" />
                                        Mark Attendance
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center gap-2 text-green-600">
                                    <Check className="h-5 w-5" />
                                    <span className="font-medium">Attendance Marked</span>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};


export default StudentView;
