import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw, CheckCircle2, XCircle } from 'lucide-react';

const MCP_SERVER_URL = 'https://test.apigee.hostelworld.com/inventory-mcp-service-plan-trip-server/mcp';

interface McpTool {
  name: string;
  description: string;
  inputSchema: any;
}

export const McpInspector = () => {
  const [tools, setTools] = useState<McpTool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const fetchTools = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(MCP_SERVER_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json, text/event-stream'
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'tools/list',
          id: 1
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.result?.tools) {
          setTools(data.result.tools);
        } else {
          setError('No tools found in response');
        }
      } else {
        setError(`Failed to fetch: ${response.status} ${response.statusText}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTools();
  }, []);

  if (!isExpanded) {
    return (
      <Button
        onClick={() => setIsExpanded(true)}
        className="fixed bottom-4 right-4 z-50 shadow-lg"
        variant="secondary"
      >
        MCP Inspector
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 z-50 w-[400px] max-h-[600px] overflow-auto shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-bold">MCP Inspector</CardTitle>
        <div className="flex gap-2">
          <Button
            onClick={fetchTools}
            variant="ghost"
            size="icon"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </Button>
          <Button
            onClick={() => setIsExpanded(false)}
            variant="ghost"
            size="icon"
          >
            ✕
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Status:</span>
            {loading ? (
              <Badge variant="secondary">
                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                Connecting...
              </Badge>
            ) : error ? (
              <Badge variant="destructive">
                <XCircle className="h-3 w-3 mr-1" />
                Error
              </Badge>
            ) : (
              <Badge variant="default" className="bg-green-500">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Connected
              </Badge>
            )}
          </div>

          {error && (
            <div className="text-sm text-destructive bg-destructive/10 p-2 rounded">
              {error}
            </div>
          )}

          <div>
            <h4 className="text-sm font-semibold mb-2">
              Available Tools ({tools.length})
            </h4>
            <div className="space-y-2">
              {tools.map((tool, index) => (
                <div key={index} className="border rounded p-2 text-sm">
                  <div className="font-medium text-primary">{tool.name}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {tool.description}
                  </div>
                  {tool.inputSchema && (
                    <details className="mt-2">
                      <summary className="text-xs cursor-pointer text-muted-foreground hover:text-foreground">
                        View Schema
                      </summary>
                      <pre className="text-xs mt-1 bg-muted p-2 rounded overflow-x-auto">
                        {JSON.stringify(tool.inputSchema, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="text-xs text-muted-foreground">
            <div className="font-medium mb-1">Server URL:</div>
            <div className="bg-muted p-2 rounded break-all">{MCP_SERVER_URL}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
