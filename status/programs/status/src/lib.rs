use anchor_lang::prelude::*;
use pyth_sdk_solana::{load_price_feed_from_account_info, PriceFeed, PriceStatus};

declare_id!("Emb6QWJDK8RVzvH3CgoQz92R8mmcBfC5tBq5wsSJXDZa");

#[program]
pub mod status {
    use super::*;

    pub fn run(ctx: Context<Run>) -> Result<()> {
        let price_feed: PriceFeed = load_price_feed_from_account_info(&ctx.accounts.price).unwrap();
        if price_feed.status == PriceStatus::Trading {
            ctx.accounts.output.trading = true as u8;
        } else {
            ctx.accounts.output.trading = false as u8;
        }

        Ok(())
    }
}

#[derive(Accounts)]
pub struct Run<'info> {
    #[account(init, payer = funding, space = 9)]
    pub output: Account<'info, Output>,
    /// CHECK: Pyth does not use Anchor
    pub price: UncheckedAccount<'info>,
    #[account(mut)]
    pub funding: Signer<'info>,
    #[account()]
    pub system_program: Program<'info, System>,
}

#[account]
pub struct Output {
    trading: u8,
}
