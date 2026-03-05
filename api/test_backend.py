import asyncio
import os
import json
from api.data_processor import get_csv_metadata
from api.gemini_service import analyze_data
from dotenv import load_dotenv

load_dotenv()

async def test_full_flow():
    test_file_path = "testing/mlb_bat_tracking_2024_2025.csv"
    
    if not os.path.exists(test_file_path):
        print(f"Error: Test file {test_file_path} not found.")
        return

    print(f"Reading {test_file_path}...")
    with open(test_file_path, "rb") as f:
        content = f.read()

    print("Extracting metadata...")
    metadata, df = get_csv_metadata(content)
    print(f"Columns: {metadata['columns']}")
    print(f"Shape: {metadata['shape']}")

    prompt = "Analyze the top 10 players with the highest average bat speed and summarize the findings."
    
    print(f"Sending to Gemini for analysis: '{prompt}'")
    try:
        result = await analyze_data(metadata, prompt)
        print("\n--- Analysis Result ---")
        print(f"Narrative Summary: {result['narrative_summary'][:200]}...")
        print(f"Structured Data Points: {len(result['structured_data'])}")
        print(f"Notebook Cells: {len(result['notebook_cells'])}")
        
        with open("api/test_output.json", "w") as out:
            json.dump(result, out, indent=2)
        print("\nFull output saved to api/test_output.json")
        
    except Exception as e:
        print(f"Error during analysis: {e}")

if __name__ == "__main__":
    if not os.getenv("GEMINI_API_KEY"):
        print("Error: GEMINI_API_KEY not found in .env")
    else:
        asyncio.run(test_full_flow())
