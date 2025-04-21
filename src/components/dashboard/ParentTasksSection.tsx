
import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Award, Clock, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

interface ParentTasksSectionProps {
  childId: string;
}

const ParentTasksSection: React.FC<ParentTasksSectionProps> = ({ childId }) => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!childId) return;

    setLoading(true);
    supabase
      .from('child_tasks')
      .select('id, status, completed_at, tasks(title, sparks_reward)')
      .eq('child_profile_id', childId)
      .then(({ data, error }) => {
        if (!error && Array.isArray(data)) setTasks(data);
      })
      .finally(() => setLoading(false));
  }, [childId]);

  const pendingTasks = tasks.filter(t => t.status !== "completed");
  const completedTasks = tasks.filter(t => t.status === "completed");

  return (
    <Card className="bg-white/5 backdrop-blur-sm border-white/10 rounded-xl p-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-wonderwhiz-bright-pink/20 flex items-center justify-center mr-3">
            <Award className="h-5 w-5 text-wonderwhiz-bright-pink" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Parent Tasks</h3>
            <p className="text-white/60 text-sm">
              Complete tasks from your parent to earn rewards!
            </p>
          </div>
        </div>
        {pendingTasks.length > 0 && (
          <Badge className="bg-wonderwhiz-bright-pink text-white border-none">
            {pendingTasks.length} pending
          </Badge>
        )}
      </div>
      <div className="space-y-2 mb-3">
        {loading ? (
          <div className="h-16 bg-white/10 animate-pulse rounded-lg"></div>
        ) : pendingTasks.length ? (
          pendingTasks.map((t, idx) => (
            <div key={t.id} className="p-2 bg-white/10 rounded flex items-center justify-between">
              <div className="flex items-center">
                <Clock className="h-4 w-4 text-wonderwhiz-bright-pink mr-2" />
                <span className="text-white">
                  {t.tasks?.title || "Task"} (Earn {t.tasks?.sparks_reward || 0} sparks)
                </span>
              </div>
              <Button size="xs" variant="secondary" className="ml-2 opacity-50 cursor-not-allowed">
                Mark as complete
              </Button>
            </div>
          ))
        ) : (
          <div className="p-2 bg-white/10 rounded flex items-center">
            <Check className="h-4 w-4 text-green-400 mr-2" />
            <span className="text-white">All parent tasks done!</span>
          </div>
        )}
      </div>
      {completedTasks.length > 0 && (
        <div className="text-xs text-white/70">
          Completed: {completedTasks.length}
        </div>
      )}
    </Card>
  );
};

export default ParentTasksSection;
