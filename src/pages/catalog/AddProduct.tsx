import { useState, type ReactNode } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { Box, Typography } from '@mui/material';
import ArrowForward from '@mui/icons-material/ArrowForward';
import Check from '@mui/icons-material/Check';
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import UploadOutlined from '@mui/icons-material/UploadOutlined';
import WarningAmber from '@mui/icons-material/WarningAmber';
import Refresh from '@mui/icons-material/Refresh';
import AddIcon from '@mui/icons-material/Add';
import Inventory2Outlined from '@mui/icons-material/Inventory2Outlined';
import TopBar from '../../layout/TopBar';
import { Btn, Card, cardSx, Chip, Field, Grid, hair, Input, Select, Stack, TextArea, Toggle, type Tone } from '../../components/kit';
import { brand, shadows, statusColors } from '../../theme';

const TABS = ['Details', 'Inventory', 'Eligibility', 'Sustainability', 'Compliance', 'Visibility', 'Costing'] as const;
type Tab = (typeof TABS)[number];

const HELPERS: Record<Tab, string> = {
  Details: 'Fill each tab. All tabs save together. Costing is added in Phase 2.',
  Inventory: 'Stock levels, size and logistics for this product.',
  Eligibility: 'Which order types this product can be part of.',
  Sustainability: 'Impact values for this product. These feed every ESG total.',
  Compliance: 'Documents and sourcing details.',
  Visibility: 'Who can see this product.',
  Costing: 'Product cost inputs. Phase 2 · feeds Cost & profit and Profit allocation. All amounts per unit in AUD.',
};

/* ───────── shared pieces ───────── */

/** "Where X are used" card: lines that link to the screen that uses the value. */
function UsedCard({ title, note, lines }: { title: string; note?: string; lines: [string, string][] }) {
  return (
    <Card title={title} subtitle="Click a line to open that screen">
      {note ? (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: '10px 14px', borderRadius: '12px', bgcolor: '#F3F6F2', fontSize: 12, color: 'text.secondary' }}>
          <InfoOutlined sx={{ fontSize: 16, color: brand.primary }} /> {note}
        </Box>
      ) : null}
      {lines.map(([a, b]) => (
        <Box key={a} component="button" type="button" sx={{ display: 'flex', alignItems: 'center', gap: 1, p: '12px 16px', borderRadius: '12px', border: hair, bgcolor: '#fff', textAlign: 'left', font: 'inherit', cursor: 'pointer', '&:hover': { bgcolor: '#FAFBF9' } }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{ fontSize: 13, fontWeight: 500 }}>{a}</Typography>
            <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>{b}</Typography>
          </Box>
          <ArrowForward sx={{ fontSize: 16, color: brand.primary }} />
        </Box>
      ))}
    </Card>
  );
}

const Two = ({ children }: { children: ReactNode }) => <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2.5 }}>{children}</Box>;

function SwitchTile({ title, sub, chip, on, tone = 'purple' }: { title: string; sub: string; chip?: string; on?: boolean; tone?: Tone }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: '12px 16px', borderRadius: '14px', bgcolor: '#F3F6F2' }}>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
          {title}
          {chip ? <Chip tone={tone}>{chip}</Chip> : null}
        </Typography>
        <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{sub}</Typography>
      </Box>
      <Toggle on={on} />
    </Box>
  );
}

function CheckTile({ label, on }: { label: string; on?: boolean }) {
  const [v, setV] = useState(!!on);
  return (
    <Box component="label" sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: '14px 16px', borderRadius: '14px', cursor: 'pointer', bgcolor: v ? '#EAF3EB' : '#F6F8F5', fontSize: 14, fontWeight: 500 }}>
      <Box component="span" sx={{ width: 20, height: 20, borderRadius: '6px', display: 'grid', placeItems: 'center', border: v ? 0 : '1px solid rgba(11,46,31,0.2)', bgcolor: v ? undefined : '#fff', background: v ? 'linear-gradient(135deg,#145233,#0E3B26)' : undefined }}>
        {v ? <Check sx={{ fontSize: 14, color: '#fff' }} /> : null}
      </Box>
      <input type="checkbox" checked={v} onChange={() => setV(!v)} style={{ display: 'none' }} />
      {label}
    </Box>
  );
}

/** Compact white value box used by the costing screen. */
function Mini({ value, calc }: { value: string; calc?: boolean }) {
  return (
    <Box sx={{ height: 24, display: 'flex', alignItems: 'center', px: 1.25, borderRadius: '8px', border: '1px solid rgba(11,46,31,0.14)', bgcolor: calc ? '#EEF1EC' : '#fff', fontSize: 11, fontWeight: calc ? 600 : 500 }}>{value}</Box>
  );
}
const CostField = ({ label, value, calc }: { label: string; value: string; calc?: boolean }) => (
  <Box>
    <Typography sx={{ fontSize: 11, fontWeight: 500, mb: 0.5 }}>{label}</Typography>
    <Mini value={value} calc={calc} />
  </Box>
);

/* ───────── tabs ───────── */

function Details({ mode }: { mode: 'new' | 'errors' | 'saved' }) {
  const err = mode === 'errors';
  const saved = mode === 'saved';
  return (
    <Grid cols="1.79fr 1fr">
      <Card title="Product details" subtitle="Shown to families, schools and businesses">
        <Two>
          <Field label="Product name" req><Input placeholder="e.g. Toilet paper rolls" value={err ? 'Toilet paper rolls' : undefined} /></Field>
          <Field label="SKU" req error={err ? 'SKU KP-TP-12 already exists. Use a unique SKU.' : undefined} hint={err ? undefined : 'Unique code used in stock and orders'}><Input placeholder="e.g. KP-TP-12" value={err ? 'KP-TP-12' : undefined} error={err} /></Field>
          <Field label="Category" req error={err ? 'Category is required.' : undefined}><Select value={err ? '' : 'Paper goods'} options={err ? ['', 'Paper goods', 'Personal care', 'Cleaning', 'Kids', 'Seasonal'] : ['Paper goods', 'Personal care', 'Cleaning', 'Kids', 'Seasonal']} error={err} /></Field>
          <Field label="Subcategory"><Select value="Tissue & paper" options={['Tissue & paper', 'Wipes', 'Towels']} /></Field>
          <Field label="Slug" chip="Storefront link"><Input value="toilet-paper-rolls" /></Field>
          <Field label="Brand" chip="Filters"><Input value="KindPack Eco" /></Field>
          <Field label="Selling price (AUD)" req error={err ? 'Enter a price greater than AUD 0.00.' : undefined}><Input value={err ? 'AUD -5.00' : 'AUD 12.00'} error={err} /></Field>
          <Field label="Status"><Select value="Active" options={['Active', 'Draft', 'Archived']} /></Field>
        </Two>
        <Field label="Description"><TextArea value="100% recycled, plastic-free wrap. Short description shown in the catalog." rows={3} /></Field>
      </Card>
      <Stack gap={3}>
        <Card title="Product image" subtitle="JPG or PNG · up to 5 MB">
          {err ? (
            <Box sx={{ height: 132, borderRadius: '18px', border: '1.5px solid #E86A5B', bgcolor: '#FDF1EF', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1, color: '#B3261E' }}>
              <WarningAmber />
              <Typography sx={{ fontSize: 12, fontWeight: 500, color: 'inherit' }}>Upload failed — file is larger than 5 MB</Typography>
              <Btn small icon={<Refresh sx={{ fontSize: 14 }} />}>Try again</Btn>
            </Box>
          ) : saved ? (
            <Box sx={{ height: 132, borderRadius: '18px', border: '1.5px solid rgba(11,46,31,0.12)', bgcolor: brand.field, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
              <Box sx={{ width: 56, height: 56, borderRadius: '16px', background: 'linear-gradient(135deg,#DCEFE0,#EEF5EF)', display: 'grid', placeItems: 'center', color: brand.primary }}>
                <Inventory2Outlined />
              </Box>
              <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>toilet-paper-12.jpg · 1.2 MB</Typography>
            </Box>
          ) : (
            <Box sx={{ height: 132, borderRadius: '18px', border: '1.5px dashed rgba(11,46,31,0.25)', bgcolor: brand.field, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
              <UploadOutlined sx={{ color: brand.slate }} />
              <Typography sx={{ fontSize: 12, fontWeight: 500 }}>Drag an image here or browse</Typography>
              <Btn small icon={<UploadOutlined sx={{ fontSize: 14 }} />}>Choose file</Btn>
            </Box>
          )}
        </Card>
        <Card title="Availability" subtitle="Who can order this product">
          <SwitchTile title="Active in catalog" sub="Visible to ordering roles" on />
          <SwitchTile title="Hero eligible" sub="Heroes can stock and sell it" on />
          <SwitchTile title="Business eligible" sub="Businesses can order it" />
        </Card>
        <UsedCard title="Where Details are used" note="Entered here when the product is created." lines={[['Name, category, price → catalog list', 'Shown to every role that can see it'], ['SKU → stock, orders and dispatch', 'Unique code across the platform'], ['Selling price → order totals and profit', 'Profit is calculated from it']]} />
      </Stack>
    </Grid>
  );
}

function InventoryTab() {
  return (
    <Grid cols="1.79fr 1fr">
      <Card title="Inventory & logistics">
        <Two>
          <Field label="Unit type" req chip="Orders · Stock"><Select value="Pack" options={['Pack', 'Bottle', 'Roll', 'Box']} /></Field>
          <Field label="Pack size" chip="Orders"><Input value="12 rolls" /></Field>
          <Field label="Barcode (EAN)" chip="Warehouse scan" ><Input value="9312345000012" /></Field>
          <Field label="Warehouse stock (units)" chip="Set in Stock" chipTone="grey"><Input value="1,240" readOnly /></Field>
          <Field label="Minimum stock threshold" chip="Low-stock alert"><Input value="400" suffix="units" /></Field>
          <Field label="Reorder level" chip="Hero & PO suggestions" chipTone="amber"><Input value="400" suffix="units" /></Field>
          <Field label="Weight" chip="Dispatch"><Input value="0.9" suffix="kg" /></Field>
          <Field label="Dimensions (L × W × H)" chip="Dispatch"><Input value="28 × 20 × 14" suffix="cm" /></Field>
        </Two>
      </Card>
      <UsedCard title="Where Inventory values are used" note="Entered here by the admin when the product is created." lines={[['Minimum threshold → low-stock alert', 'Status turns Low stock below the threshold'], ['Reorder level → suggested reorder', 'Suggested quantity for Heroes and purchase orders'], ['Weight & size → routing and packing', 'Used when choosing Hero or main centre'], ['Warehouse stock is changed only by adjustments', 'Not edited here']]} />
    </Grid>
  );
}

function EligibilityTab() {
  return (
    <Grid cols="1.79fr 1fr">
      <Card title="Platform eligibility">
        <SwitchTile title="Subscription eligible" chip="Subscriptions" sub="Can be added to a family subscription" on />
        <SwitchTile title="Bundle eligible" chip="Bundles" sub="Can be part of a product bundle" on />
        <SwitchTile title="B2B eligible" chip="Business orders" sub="Businesses can order it in bulk" />
        <SwitchTile title="School-support eligible" chip="Profit share" sub="Orders count towards the linked school’s profit share" on />
      </Card>
      <UsedCard title="Where Eligibility is used" note="Entered here. Each flag controls a different part of the platform." lines={[['Subscription eligible → plan contents', 'Shown when building a plan'], ['B2B eligible → business ordering', 'Appears in business catalog and orders'], ['School-support eligible → school’s 50 % share', 'Only these products add to school earnings'], ['School earnings follow the order’s linked school', 'Each order links to one school']]} />
    </Grid>
  );
}

function SustainabilityTab() {
  return (
    <Grid cols="1.79fr 1fr">
      <Card title="Sustainability attributes">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: '10px 14px', borderRadius: '12px', bgcolor: statusColors.amber.bg, color: statusColors.amber.fg, fontSize: 12 }}>
          <InfoOutlined sx={{ fontSize: 16 }} /> Values are illustrative until a source is attached. Without evidence they are saved as “Unverified”.
        </Box>
        <Two>
          <Field label="CO₂ saving per unit" chip="Order → Family → School"><Input value="0.42" suffix="kg CO₂" /></Field>
          <Field label="Plastic saving per unit" chip="Plastic counters"><Input value="52" suffix="grams" /></Field>
          <Field label="Recycled content" chip="Product page · ESG"><Input value="78" suffix="%" /></Field>
          <Field label="Water saving per unit (optional)" chip="Water totals"><Input value="—" suffix="litres" /></Field>
        </Two>
        <SwitchTile title="Biodegradable / compostable" chip="Product page" sub="Shown as a badge on the product" on />
        <SwitchTile title="Refillable" chip="Refill impact" sub="Counts towards refill and returns impact" on />
        <Two>
          <Field label="Eco certification" chip="Evidence"><Select value="" options={['', 'GECA', 'FSC', 'Cradle to Cradle']} /></Field>
          <Field label="Evidence / source" chip="Verified status" chipTone="amber"><Input placeholder="Attach LCA report or link" suffix={<UploadOutlined sx={{ fontSize: 18 }} />} /></Field>
        </Two>
      </Card>
      <UsedCard title="Where Sustainability values are used" note="Entered here per product. Order, family, school and platform totals are calculated from it." lines={[['Order impact = quantity × these values', 'Calculated for every order'], ['All products with their values', 'Table of the six values per product'], ['Totals shown to the public', 'Only verified values are published'], ['Impact shown on one order', 'Card “Impact of this order”']]} />
    </Grid>
  );
}

function ComplianceTab() {
  return (
    <Grid cols="1.79fr 1fr">
      <Card title="Compliance & sourcing">
        <Field label="Safety data sheet (SDS)" chip="Warehouse receiving" chipTone="amber"><Input placeholder="Upload PDF · required for chemicals" suffix={<UploadOutlined sx={{ fontSize: 18 }} />} /></Field>
        <Two>
          <Field label="Supplier" chip="Costing"><Select value="EcoSupply Co." options={['EcoSupply Co.', 'GreenPaper Ltd']} /></Field>
          <Field label="Manufacturer" chip="Labels"><Input value="GreenPaper Ltd" /></Field>
        </Two>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: '10px 14px', borderRadius: '12px', bgcolor: statusColors.blue.bg, color: statusColors.blue.fg, fontSize: 12 }}>
          <InfoOutlined sx={{ fontSize: 16 }} /> Supplier cost and freight are entered later in Costing (Phase 2). They are not duplicated here.
        </Box>
      </Card>
      <UsedCard title="Where Compliance data is used" note="Entered here when the product is created." lines={[['Supplier → supplier cost in landing cost', 'Costing is filled in Phase 2'], ['Incoming shipments list the supplier', 'Shown on each shipment'], ['SDS file opens from the product', 'Chemicals need a file before activation']]} />
    </Grid>
  );
}

function VisibilityTab() {
  return (
    <Grid cols="1.79fr 1fr">
      <Card title="Who can see it">
        {[['B2C (public storefront)', true], ['B2B (business accounts)', false], ['School', true], ['Family', true], ['Hero', true], ['Business', false]].map(([l, on]) => (
          <CheckTile key={l as string} label={l as string} on={on as boolean} />
        ))}
      </Card>
      <UsedCard title="Where Visibility is used" note="Entered here. It filters the catalog for every role." lines={[['Each role sees its own catalog', 'Products hidden from a role never appear for it'], ['Heroes only see Hero-visible products in stock requests', 'Request list is limited to these products'], ['Business catalog follows B2B / Business', 'Controls what businesses can order']]} />
    </Grid>
  );
}

function CostingTab() {
  return (
    <Grid cols="1.79fr 1fr">
      <Card title="Costing" subtitle="Landing cost is per unit. Operating cost is per order and set once for all products.">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: '10px 14px', borderRadius: '12px', bgcolor: statusColors.blue.bg, color: statusColors.blue.fg, fontSize: 12 }}>
          <InfoOutlined sx={{ fontSize: 16 }} /> Per unit and per order, AUD. Tax basis, rounding and any separate delivery fee are awaiting business confirmation.
        </Box>
        <Box>
          <Typography sx={{ fontSize: 14, fontWeight: 600, color: brand.primary }}>Landing cost</Typography>
          <Typography sx={{ fontSize: 11, color: 'text.secondary', mb: 1.5 }}>Supplier cost + inbound freight per unit</Typography>
          <Two>
            <CostField label="Supplier cost" value="AUD 6.00" />
            <CostField label="Inbound freight" value="AUD 1.00" />
            <CostField label="Duties & import" value="AUD 0.00" />
            <CostField label="Other landing cost" value="AUD 0.00" />
            <CostField label="Landing cost (calculated)" value="AUD 7.00" calc />
            <CostField label="Counted once" value="Not repeated in operating cost" calc />
          </Two>
        </Box>
        <Box>
          <Typography sx={{ fontSize: 14, fontWeight: 600, color: brand.primary }}>Operating cost</Typography>
          <Typography sx={{ fontSize: 11, color: 'text.secondary', mb: 1.5 }}>Fulfilment costs of one order · shared by every product in it</Typography>
          <Two>
            <CostField label="Packing (per order)" value="AUD 3.00" />
            <CostField label="Handling (per order)" value="AUD 2.00" />
            <CostField label="Local Hero delivery (per order)" value="AUD 5.00" />
            <CostField label="Operating cost per order" value="AUD 10.00" calc />
          </Two>
        </Box>
        <Box>
          <Typography sx={{ fontSize: 14, fontWeight: 600, color: brand.primary }}>Per unit</Typography>
          <Typography sx={{ fontSize: 11, color: 'text.secondary', mb: 1.5 }}>Profit and the 50 / 10 / 5 / 35 split are calculated per order, not per product</Typography>
          <Two>
            <CostField label="Landing cost per unit" value="AUD 7.00" calc />
            <CostField label="Selling price (Details tab)" value="AUD 12.00" calc />
            <CostField label="Margin before order costs" value="AUD 5.00" calc />
            <CostField label="Profit is split per order" value="See Cost & profit" calc />
          </Two>
        </Box>
      </Card>
      <Stack gap={3}>
        <Card title="Worked example" subtitle="Example only">
          {[['Selling amount', 'AUD 100.00'], ['− Landing cost', 'AUD 60.00'], ['− Operating cost', 'AUD 10.00']].map(([a, b]) => (
            <Box key={a} sx={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
              <span>{a}</span>
              <b>{b}</b>
            </Box>
          ))}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 600, pt: 1.25, borderTop: hair }}>
            <span>= Profit</span>
            <span>AUD 30.00</span>
          </Box>
          <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>School 15 · Hero 3 · Kids 1.50 · KindPack 10.50</Typography>
        </Card>
        <UsedCard title="Where Costing is used" lines={[['Landing + operating cost → total cost', ''], ['Profit → split into four shares', ''], ['Profit shown on each order', '']].map(([a, b]) => [a, b] as [string, string])} />
      </Stack>
    </Grid>
  );
}

/* ───────── page ───────── */

export default function AddProduct() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const tabParam = (params.get('tab') ?? 'details').toLowerCase();
  const tab = TABS.find((t) => t.toLowerCase() === tabParam) ?? 'Details';
  const [local, setLocal] = useState<'new' | 'saved'>('new');
  const state = (params.get('state') as 'errors' | 'saved' | null) ?? (local === 'saved' ? 'saved' : 'new');
  const errors = state === 'errors';
  const saved = state === 'saved';
  const mode = errors ? 'errors' : saved ? 'saved' : 'new';

  return (
    <Stack gap={3}>
      <TopBar title="Add product" helper={HELPERS[tab]} />
      <Box sx={{ display: 'flex', gap: 1.25, flexWrap: 'wrap', mt: -1 }}>
        {TABS.map((t) => {
          const on = t === tab;
          return (
            <Box key={t} component="button" type="button" onClick={() => setParams((p) => { const n = new URLSearchParams(p); n.set('tab', t.toLowerCase()); return n; })} sx={{ height: 38, px: '18px', borderRadius: 999, border: on ? 0 : '1px solid rgba(11,46,31,0.08)', font: 'inherit', fontSize: 12, fontWeight: 500, cursor: 'pointer', bgcolor: on ? undefined : '#fff', background: on ? 'linear-gradient(148deg,#145233,#0E3B26)' : undefined, color: on ? '#fff' : brand.ink, boxShadow: on ? shadows.card : 'none' }}>
              {t}
            </Box>
          );
        })}
      </Box>

      {errors ? (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: '14px 20px', borderRadius: '16px', bgcolor: statusColors.red.bg, color: statusColors.red.fg }}>
          <WarningAmber sx={{ fontSize: 20 }} />
          <Box>
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: 'inherit' }}>Fix 4 issues before saving</Typography>
            <Typography sx={{ fontSize: 13, color: 'inherit' }}>Required fields are marked below. Nothing has been saved.</Typography>
          </Box>
        </Box>
      ) : null}
      {saved ? (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: '12px 20px', borderRadius: '16px', bgcolor: statusColors.green.bg, color: statusColors.green.fg, flexWrap: 'wrap' }}>
          <Check sx={{ fontSize: 20 }} />
          <Box sx={{ flex: 1, minWidth: 200 }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: 'inherit' }}>Product saved</Typography>
            <Typography sx={{ fontSize: 13, color: 'inherit' }}>“Toilet paper rolls” (KP-TP-12) is now active in the catalog.</Typography>
          </Box>
          <Btn small onClick={() => navigate('/catalog')}>View product</Btn>
          <Btn small kind="primary" icon={<AddIcon sx={{ fontSize: 16 }} />} onClick={() => { setLocal('new'); setParams({}); }}>Add another</Btn>
        </Box>
      ) : null}

      {tab === 'Details' && <Details mode={mode} />}
      {tab === 'Inventory' && <InventoryTab />}
      {tab === 'Eligibility' && <EligibilityTab />}
      {tab === 'Sustainability' && <SustainabilityTab />}
      {tab === 'Compliance' && <ComplianceTab />}
      {tab === 'Visibility' && <VisibilityTab />}
      {tab === 'Costing' && <CostingTab />}

      <Box sx={{ ...cardSx, display: 'flex', alignItems: 'center', gap: 2, px: 3, py: 2, flexWrap: 'wrap' }}>
        {saved ? <Check sx={{ fontSize: 16, color: brand.primary }} /> : <Box sx={{ width: 7, height: 7, borderRadius: '4px', bgcolor: brand.amber }} />}
        <Typography sx={{ flex: 1, fontSize: 12, color: 'text.secondary' }}>{saved ? 'All changes saved · just now' : errors ? 'Unsaved changes · 4 issues' : 'Unsaved changes · all tabs save together'}</Typography>
        <Btn onClick={() => navigate('/catalog')}>Cancel</Btn>
        <Btn kind="primary" icon={<Check />} disabled={errors || saved} onClick={() => setLocal('saved')}>{saved ? 'Saved' : 'Save product'}</Btn>
      </Box>
    </Stack>
  );
}
