import pandas as pd
import io

def get_csv_metadata(file_content: bytes):
    """
    Extracts schema, data types, and a sample from a CSV file.
    """
    df = pd.read_csv(io.BytesIO(file_content))
    
    metadata = {
        "columns": df.columns.tolist(),
        "dtypes": df.dtypes.astype(str).to_dict(),
        "sample": df.head(5).to_dict(orient="records"),
        "shape": df.shape,
        "summary_stats": df.describe(include='all').to_dict()
    }
    
    return metadata, df
