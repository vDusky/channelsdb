import json
from pathlib import Path

from api.main import app
from api.config import config
from api.common import CHANNEL_TYPES
from pydantic import BaseModel, create_model


TunnelModel = create_model('TunnelTypes', **{tunnel: (int, ...) for tunnel in CHANNEL_TYPES.values()})


class StatisticsModel(BaseModel):
    date: str
    statistics: TunnelModel


@app.get('/statistics', name='General statistics', tags=['General'], description='Returns summary statistics about the data stored')
async def get_statistics() -> StatisticsModel:
    with open(Path(config['dirs']['base']) / 'pdb_stats.json') as f:
        return json.load(f)