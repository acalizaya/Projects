import pandas as pd

try:
    # 1. Create a Data Frame by reading orders.csv file
    orders = pd.read_csv("orders.csv")
    ordersDetails = pd.read_csv("order_details.csv")

    # 2. Joining two data frames
    combinedDf = pd.merge(orders, ordersDetails, on="order_id")

    # 3. Calculating Product Revenue in a New Column
    combinedDf["product_revenue"] = combinedDf["unit_price"] * combinedDf["quantity"]

    # 4. Group data by shipping country and counting Unique Order IDs
    ordersByCountry = combinedDf.groupby("ship_country")
    ordersByCountry = ordersByCountry.agg({"product_revenue": "sum"})

    # 5. Sorting the results returned above in descending order.
    ordersByCountry.sort_values(by=["product_revenue"], ascending=False, inplace=True)

    # 6. printing top 5 countries with most orders.
    print(ordersByCountry.head(6))
except NameError:
    print("NameError : ordersByCountry Does not Exist")
