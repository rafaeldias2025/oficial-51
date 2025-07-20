import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Section } from './AssessmentEngine';

interface QuestionSectionProps {
  section: Section;
  answers: Record<string, any>;
  onAnswer: (questionId: string, value: any) => void;
}

export const QuestionSection: React.FC<QuestionSectionProps> = ({
  section,
  answers,
  onAnswer
}) => {
  const renderQuestion = (question: any, index: number) => {
    const answer = answers[question.id];
    
    switch (question.type) {
      case 'scale':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label htmlFor={question.id} className="text-lg font-medium">
                {question.text}
              </Label>
              <span className="text-2xl font-bold" style={{ color: section.color }}>
                {answer !== null && answer !== undefined ? answer : '-'}
              </span>
            </div>
            
            <div className="pt-2 px-2">
              <Slider
                id={question.id}
                min={question.min || 1}
                max={question.max || 10}
                step={1}
                value={answer !== null && answer !== undefined ? [answer] : [Math.floor((question.min || 1 + (question.max || 10)) / 2)]}
                onValueChange={(value) => onAnswer(question.id, value[0])}
                className="cursor-pointer"
              />
              
              <div className="flex justify-between mt-1 text-sm text-muted-foreground">
                <span>{question.min || 1}</span>
                <span>{question.max || 10}</span>
              </div>
            </div>
          </div>
        );
        
      case 'multiple_choice':
        return (
          <div className="space-y-4">
            <Label htmlFor={question.id} className="text-lg font-medium">
              {question.text}
            </Label>
            
            <RadioGroup
              id={question.id}
              value={answer}
              onValueChange={(value) => onAnswer(question.id, value)}
              className="grid grid-cols-1 gap-3 pt-2"
            >
              {(question.options || []).map((option: string, optIndex: number) => (
                <div key={optIndex} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`${question.id}-${optIndex}`} />
                  <Label htmlFor={`${question.id}-${optIndex}`} className="text-base">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        );
        
      case 'text':
        return (
          <div className="space-y-4">
            <Label htmlFor={question.id} className="text-lg font-medium">
              {question.text}
            </Label>
            
            <Textarea
              id={question.id}
              value={answer || ''}
              onChange={(e) => onAnswer(question.id, e.target.value)}
              placeholder="Digite sua resposta aqui..."
              className="min-h-[100px]"
            />
          </div>
        );
        
      case 'date':
        return (
          <div className="space-y-4">
            <Label htmlFor={question.id} className="text-lg font-medium">
              {question.text}
            </Label>
            
            <Input
              id={question.id}
              type="date"
              value={answer || ''}
              onChange={(e) => onAnswer(question.id, e.target.value)}
              className="max-w-xs"
            />
          </div>
        );
        
      case 'number':
        return (
          <div className="space-y-4">
            <Label htmlFor={question.id} className="text-lg font-medium">
              {question.text}
            </Label>
            
            <Input
              id={question.id}
              type="number"
              value={answer !== null && answer !== undefined ? answer : ''}
              onChange={(e) => onAnswer(question.id, parseFloat(e.target.value))}
              className="max-w-xs"
            />
          </div>
        );
        
      default:
        return (
          <div className="space-y-4">
            <Label htmlFor={question.id} className="text-lg font-medium">
              {question.text}
            </Label>
            
            <Input
              id={question.id}
              value={answer || ''}
              onChange={(e) => onAnswer(question.id, e.target.value)}
              placeholder="Digite sua resposta aqui..."
            />
          </div>
        );
    }
  };
  
  return (
    <div className="space-y-8">
      {section.questions.map((question, index) => (
        <motion.div
          key={question.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: section.color }}>
            <CardContent className="p-6">
              {renderQuestion(question, index)}
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}; 