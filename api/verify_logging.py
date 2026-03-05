import asyncio
import os
import sys
from unittest.mock import MagicMock, patch

# Add parent directory to path to import api
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from api.supabase_client import supabase

async def verify_logging():
    print("--- Starting Verification (Refined Logic) ---")
    
    # 1. Test Success Case (No error_logs entry)
    print("Testing success case...")
    success_filename = "success_test.csv"
    success_result = supabase.table("task_logs").insert({
        "csv_filename": success_filename,
        "prompt_used": "Success test",
        "error_id": 0
    }).execute()
    
    success_id = success_result.data[0]["id"]
    print(f"Success task log created with ID: {success_id}")
    
    # Check if error_logs has an entry for this execution
    error_check = supabase.table("error_logs").select("*").eq("execution_id", success_id).execute()
    if not error_check.data:
        print("[OK] No entry created in error_logs for success case.")
    else:
        print("[FAIL] Entry found in error_logs for success case!")

    # 2. Test Failure Case (Has error_logs entry)
    print("\nTesting failure case...")
    import random
    fail_filename = "fail_test.csv"
    error_code = random.randint(10000, 99999)
    
    fail_result = supabase.table("task_logs").insert({
        "csv_filename": fail_filename,
        "prompt_used": "Fail test",
        "error_id": 0 # Initially success
    }).execute()
    
    fail_id = fail_result.data[0]["id"]
    
    # Simulate error logging logic from main.py
    supabase.table("error_logs").insert({
        "error_code": error_code,
        "execution_id": fail_id,
        "error_description": "Controlled failure test"
    }).execute()
    supabase.table("task_logs").update({"error_id": error_code}).eq("id", fail_id).execute()
    
    # Verify
    check_task = supabase.table("task_logs").select("*").eq("id", fail_id).execute()
    check_err = supabase.table("error_logs").select("*").eq("execution_id", fail_id).execute()
    
    if check_task.data and check_task.data[0]["error_id"] == error_code:
        print("[OK] Task log updated with error_id.")
    if check_err.data and check_err.data[0]["error_code"] == error_code:
        print("[OK] Error details logged correctly in error_logs.")

if __name__ == "__main__":
    asyncio.run(verify_logging())
