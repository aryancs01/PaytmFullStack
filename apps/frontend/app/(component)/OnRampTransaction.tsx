import { Card } from "./(ui)/Card"

enum OnRampStatus {
    Success,
    Failure,
    Processing
}


export const OnRampTransaction = ({
    transactions
}: {
    transactions: {
        time: Date,
        amount: number,
        status: OnRampStatus | string,
        provider: string
    }[]
}) => {
    if (!transactions.length) {
        return <Card title="Recent Transactions">
            <div className="text-center pb-8 pt-8">
                No Recent transactions
            </div>
        </Card>
    }
    return <Card title="Recent Transactions">
        <div className="pt-2">
            {transactions.map((t, index) => <div key={index} className="flex justify-between">
                <div className="w-full bg-gray-100 p-2 rounded-sm border-b-2">
                    <div className="text-sm">
                        Received INR
                    </div>
                    <div className=" flex justify-between items-center">
                        <div className="text-slate-600 text-xs">
                            {t.time.toDateString()}
                        </div>
                        <div className="flex flex-col justify-center">
                            + Rs {t.amount / 100}
                        </div>
                    </div>

                </div>
            </div>)}
        </div>
    </Card>
}