import subprocess
import sys
import os

print("🚀 Running Artillery Load Test (This will take 50 seconds)...")

try:
    # 1. Run the test and save as JSON
    subprocess.run(
        ["npx", "artillery", "run", "test-rabbitmq.yml", "--output", "report.json"],
        check=True,
        shell=True 
    )
except subprocess.CalledProcessError:
    print("❌ Artillery test failed.")
    sys.exit(1)

print("\n📈 Generating Beautiful HTML Graphs and Tables...")
try:
    # 2. Tell Artillery to build the offline HTML dashboard!
    subprocess.run(
        ["npx", "artillery", "report", "report.json"],
        check=True,
        shell=True 
    )
    
    # 3. Open it in your browser (Windows command)
    print("\n✅ Opening the HTML Report with your graphs and tables!")
    os.system("start report.json.html") 
    
except Exception as e:
    print("❌ Failed to generate report:", e)
