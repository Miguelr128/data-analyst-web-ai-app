from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
import os
import shutil
import tempfile
import json

from api.data_processor import get_csv_metadata
from api.gemini_service import analyze_data
from api.notebook_utils import create_jupyter_notebook, save_notebook
from api.supabase_client import supabase

app = FastAPI(title="AI Data Agent API")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/analyze")
async def handle_analyze(
    file: UploadFile = File(...),
    prompt: str = Form(...)
):
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Only CSV files are allowed")
    
    # Initialize task log
    log_data = {
        "csv_filename": file.filename,
        "prompt_used": prompt,
        "error_id": 0 # Default to success
    }
    
    execution_result = supabase.table("task_logs").insert(log_data).execute()
    execution_id = execution_result.data[0]["id"] if execution_result.data else None
    
    try:
        content = await file.read()
        metadata, df = get_csv_metadata(content)
        
        analysis_result = await analyze_data(metadata, prompt)
        
        return analysis_result
    except Exception as e:
        error_description = str(e)
        # Assign a random/specific error code for this demo, or use 1
        error_code = 1 
        
        # Log error
        if execution_id:
            supabase.table("error_logs").insert({
                "error_code": error_code,
                "execution_id": execution_id,
                "error_description": error_description
            }).execute()
            
            # Update task log with error_id
            supabase.table("task_logs").update({"error_id": error_code}).eq("id", execution_id).execute()

        return JSONResponse(status_code=500, content={"detail": error_description})

@app.post("/export-notebook")
async def handle_export(data: dict):
    if "notebook_cells" not in data:
        raise HTTPException(status_code=400, detail="No notebook cells provided")
    
    try:
        nb = create_jupyter_notebook(data["notebook_cells"])
        
        fd, path = tempfile.mkstemp(suffix=".ipynb")
        try:
            with os.fdopen(fd, 'w', encoding='utf-8') as f:
                import nbformat
                nbformat.write(nb, f)
            
            return FileResponse(
                path, 
                media_type="application/x-ipynb+json", 
                filename="analysis_report.ipynb"
            )
        finally:
            pass
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
